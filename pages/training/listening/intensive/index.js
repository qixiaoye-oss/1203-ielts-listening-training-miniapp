const api = getApp().api
const audioApi = getApp().audioApi
const loadingProgress = require('../../../../behaviors/loadingProgress')

let audioContext
let inputTimer
Page({
  behaviors: [loadingProgress],
  data: {
    areaTop: -2,
    areaLeft: 0,
    bodyHeight: '',
    swiperCurrent: 0,
    audioState: 'none', // 音频播放状态
    audioEndTime: 0, // 音频结束播放时间
    playingSmallIndex: -1, // 正在播放的小句子下标
    showArticle: false, // 是否显示文本
    baseShowArticle: false, // 全局设置是否显示文本
    schedule: 0, // 总进度
    completelyOver: false, // 是否播放到最后
    showActionsheet: false, // 倍速选择
    playbackRate: 1, // 倍速
    playbackRateStr: 1.0,
    audioDownProgress: 100, // 音频下载进度
    groups: [
      {
        text: '文章显示',
        type: 'warn',
        value: 3
      }
    ],
    showPl: true,
  },
  // 生命周期函数==============
  onLoad: function (options) {
    this.setData({ audioState: 'none' })
    this.startLoading()
    this.listListening(false)
  },
  onShow: function () {
    const { platform } = wx.getDeviceInfo()
    if (platform == 'ios') {
      this.setData({ areaTop: -6, areaLeft: -4 })
    }
    if (!api.isEmpty(this.data.index)) {
      let list = wx.getStorageSync('listenings')
      let index = Number(this.data.index) + 1
      let i = Number(this.data.index)
      this.setData({
        swiperCurrent: i,
        schedule: ((index / list.length) * 100),
        showArticle: false,
        index: ''
      })
      this.stopAudio()
      this.playAudio()
      // 保存进度
      this.saveCurrent()
    }
  },
  onHide: function () {
    let { audioState } = this.data
    if (audioState === 'playing') {
      this.setData({ audioState: 'none', playingSmallIndex: -1 })
    }
    // this.stopAudio()
  },
  onUnload: function () {
    this.stopAudio()
    audioContext.destroy()
    audioApi.delAudioFile()
  },
  onReady() {
    const { windowHeight } = wx.getWindowInfo()
    this.setData({ bodyHeight: (windowHeight - 185) + 'px' })
  },
  // 业务======================
  //切换卡片
  swiperSwitch({ detail }) {
    // 手动切换不播放音频
    if (detail.source !== "touch") {
      return
    }
    this.stopAudio()
    this.textareaBlur()
    const { list } = this.data
    this.setData({
      swiperCurrent: detail.current,
      audioState: 'none',
      showArticle: false,
      schedule: (((detail.current + 1) / list.length) * 100)
    })
    wx.nextTick(() => {
      this.playAudio()
    })
  },
  // 音频播放监听
  audioContextListener() {
    audioContext.onEnded(() => {
      this.setData({
        audioState: 'stop',
        completelyOver: true
      })
    })
    audioContext.onPlay(() => {
      this.setData({ audioState: 'playing' })
    })
    audioContext.onStop(() => {
      this.setData({ audioState: 'stop', playingSmallIndex: -1 })
    })
    audioContext.onPause(() => {
      this.setData({ audioState: 'stop', playingSmallIndex: -1 })
    })
    audioContext.onTimeUpdate(() => {
      const { audioEndTime } = this.data
      this.setSentencePlayingStatus()
      if (audioContext.currentTime >= audioEndTime && audioEndTime != 0 && audioContext.currentTime != 0) {
        this.stopAudio()
        this.setData({ playingSmallIndex: -1 })
      }
    })
  },
  // 计算播放到哪个句子
  setSentencePlayingStatus() {
    let list = wx.getStorageSync('listenings')
    let { swiperCurrent } = this.data
    let sentence = list[swiperCurrent].list
    for (let i = 0; i < sentence.length; i++) {
      const leftTime = audioApi.millis2Seconds(sentence[i].startTimeMillis) - 0.1
      const rightTime = audioApi.millis2Seconds(sentence[i].endTimeMillis)
      if (audioContext.currentTime >= leftTime && audioContext.currentTime <= rightTime) {
        this.setData({ playingSmallIndex: i })
      }
    }
  },
  // 大句子播放
  playAudio() {
    let list = wx.getStorageSync('listenings')
    let { swiperCurrent } = this.data
    let paragraph = list[swiperCurrent]
    let startTime = audioApi.millis2Seconds(paragraph.startTimeMillis)
    startTime = startTime == 0 ? startTime : (startTime - 0.1)
    wx.nextTick(() => {
      audioContext.seek(startTime)
      audioContext.startTime = startTime
      audioContext.play()
    })
    this.setData({
      audioEndTime: audioApi.millis2Seconds(paragraph.endTimeMillis),
      playType: 'whole',
    })
    // 保存播放记录
    this.saveRecord()
  },
  // 切换下一个大句子
  nextSentence() {
    this.stopAudio()
    // 保存输入内容
    this.saveLabel()
    // 播放下一个句子
    this.nextAudio()
    // 保存进度
    this.saveCurrent()
  },
  // 切换下一句-完全听懂
  nextSentence2() {
    let { swiperCurrent, list } = this.data
    // 如果没听过该句或者该句进行了标注则无法点击完全听懂
    if (list[swiperCurrent].status == 0 || list[swiperCurrent].label) {
      return
    }
    // 停止播放当前句子
    this.stopAudio()
    // 保存输入内容
    this.saveLabel2()
    this.nextAudio()
    // 保存进度
    this.saveCurrent()
  },
  //播放下一个
  nextAudio() {
    let { swiperCurrent, list } = this.data
    if (swiperCurrent >= list.length) {
      api.toast('已经最后一句啦！')
      return
    }
    this.setData({
      swiperCurrent: swiperCurrent + 1,
      schedule: (((swiperCurrent + 2) / list.length) * 100),
      showArticle: false
    })
    this.playAudio()
  },
  //小句子播放
  listenSentenceAgain(e) {
    this.stopAudio()
    let { swiperCurrent, list } = this.data
    let idx = e.currentTarget.dataset.idx
    let sentence = list[swiperCurrent].list[idx]
    this.setData({
      audioEndTime: audioApi.millis2Seconds(sentence.endTimeMillis),
      playingSmallIndex: idx,
      playType: 'single'
    })
    let startTime = audioApi.millis2Seconds(sentence.startTimeMillis)
    startTime = startTime == 0 ? startTime : (startTime - 0.1)
    wx.nextTick(() => {
      audioContext.seek(startTime)
      audioContext.startTime = startTime
      audioContext.play()
    })
  },
  //重新播放
  listenAgain: function () {
    this.stopAudio()
    this.playAudio()
  },
  stopAudio() {
    if (!audioContext.paused) {
      audioContext.stop()
      // audioContext.pause()
    }
    // 判断是否是最后一个
    const { swiperCurrent, list } = this.data
    this.setData({
      completelyOver: (swiperCurrent + 1) === list.length
    })
  },
  toList: function () {
    let { swiperCurrent, list } = this.data
    wx.navigateTo({
      url: '../sentence/index?sid=' + this.options.setId + "&paragraphId=" + list[swiperCurrent].id
    })
  },
  toExam() {
    this.saveLabel3()
  },
  textareaFocus() {
    this.setData({ showPl: false })
  },
  textareaBlur() {
    this.setData({ showPl: true })
  },
  // 标注句子
  inputVal({ detail }) {
    const _this = this
    let { swiperCurrent } = this.data
    let list = wx.getStorageSync('listenings')
    list[swiperCurrent].label = detail.value
    wx.setStorageSync('listenings', list)
    this.setData({
      [`list[${swiperCurrent}].label`]: detail.value,
    })
    // 定时
    clearTimeout(inputTimer)
    inputTimer = setTimeout(() => {
      _this.saveLabel()
    }, 500);
  },
  showArticle: function () {
    this.setData({
      showArticle: !this.data.showArticle
    })
  },
  playSet() {
    let path = `groups[${this.data.groups.length - 1}].text`
    this.setData({
      [path]: this.data.baseShowArticle ? '文章显示：关闭常开' : '文章显示：常开',
      showActionsheet: true
    })
  },
  btnClick(e) {
    const val = e.detail.value
    if (val === 3) {
      this.setData({
        baseShowArticle: !this.data.baseShowArticle,
        showActionsheet: false
      })
    } else {
      audioContext.playbackRate = val
      audioContext.pause()
      audioContext.play()
      this.setData({
        playbackRate: val,
        playbackRateStr: (val == 1 || val == 2) ? val + '.0' : val,
        showActionsheet: false
      })
    }
  },
  // 请求数据 ================================
  // 获取数据
  listListening(isPull) {
    let _this = this
    api.request(this, `/part/v1/sentence/${this.options.partId}`, {}, isPull, true).then(res => {
      wx.setStorageSync('listenings', res.list)
      this.setData({
        schedule: (((res.swiperCurrent + 1) / res.list.length) * 100),
        audioUrl: res.audioUrl,
        audioDownProgress: 0 // 开始下载音频
      })
      audioApi.initAudio(res.audioUrl, (progress) => {
        _this.setData({ audioDownProgress: progress })
      }).then(data => {
        audioContext = data
        _this.audioContextListener()
        _this.finishLoading()
        _this.setData({ audioDownProgress: 100 })
      })
    }).catch(() => {
      _this.finishLoading()
      _this.setData({ audioDownProgress: 100 })
    })
  },
  // 保存标注
  saveLabel() {
    // let { swiperCurrent, list } = this.data
    // api.request(this, '/intensiveListening/addLabelRecord', {
    //   content: list[swiperCurrent].label,
    //   albumId: this.options.aid,
    //   setId: this.options.sid,
    //   sentenceId: list[swiperCurrent].id,
    //   userId: api.getUserId(),
    //   recordId: this.data.recordId
    // }, false, false, 'POST')
  },
  // 完全听懂标注
  saveLabel2() {
    // let { swiperCurrent, list } = this.data
    // api.request(this, '/intensiveListening/addLabelRecord', {
    //   status: 1,
    //   albumId: this.options.aid,
    //   setId: this.options.sid,
    //   sentenceId: list[swiperCurrent].id,
    //   userId: api.getUserId(),
    //   recordId: this.data.recordId
    // }, false, false, 'POST')
  },
  // 保存所有标注
  saveLabel3() {
    // let list = wx.getStorageSync('listenings')
    // let recordDetail = []
    // for (let i = 0; i < list.length; i++) {
    //   recordDetail.push({
    //     recordId: this.data.recordId,
    //     sentenceId: list[i].id,
    //     content: list[i].label
    //   })
    // }
    // api.request(this, '/intensiveListening/saveLabelRecord', {
    //   albumId: this.options.aid,
    //   setId: this.options.sid,
    //   userId: api.getUserId(),
    //   recordId: this.data.recordId,
    //   recordDetails: recordDetail
    // }, false, false, 'POST').then(res => {
    //   wx.redirectTo({
    //     url: '../intensive_record/intensive_record?recordId=' + this.data.recordId + '&setId=' + this.options.sid,
    //   })
    // })
  },
  // 保存播放记录
  saveRecord() {
    let { swiperCurrent, list } = this.data
    api.request(this, '/record/v1/save/record', {
      ...this.options,
      sentenceId: list[swiperCurrent].id,
    }, false, 'POST').then(res => {
      let list = wx.getStorageSync('listenings')
      list[swiperCurrent].status = 1
      wx.setStorageSync('listenings', list)
      this.setData({
        [`list[${swiperCurrent}].status`]: 1
      })
    })
  },
  // 保存进度
  saveCurrent() {
    api.request(this, '/record/v1/save/progress', {
      ...this.options,
      currentIndex: this.data.swiperCurrent,
    }, false, "POST")
  },
})