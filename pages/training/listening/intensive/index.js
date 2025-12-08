const api = getApp().api
const audioApi = getApp().audioApi
const pageLoading = require('../../../../behaviors/pageLoading.js')
const audioLoading = require('../../../../behaviors/audioLoading.js')

let audioContext
let inputTimer
Page({
  behaviors: [pageLoading, audioLoading],
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
    groups: [
      {
        text: '文章显示',
        type: 'warn',
        value: 3
      }
    ],
    showPl: true,
    saveFlag: false
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
    // 记一次句子播放记录
    this.saveSentencePlayingRecord()
  },
  // 切换下一个大句子
  nextSentence() {
    // 停止播放当前句子
    this.stopAudio()
    // 播放下一个句子
    this.nextAudio()
  },
  // 切换下一句-完全听懂
  nextSentence2() {
    let { swiperCurrent, list } = this.data
    // 如果没听过该句或者该句进行了标注则无法点击完全听懂
    if (list[swiperCurrent].status == 0 || list[swiperCurrent].label) {
      return
    }
    // 修改该句子标注状态
    list[swiperCurrent].status = '2'
    wx.setStorageSync('listenings', list)
    this.setData({
      [`list[${swiperCurrent}].status`]: '2',
    })
    // 停止播放当前句子
    this.stopAudio()
    // 播放下一个句子
    this.nextAudio()
  },
  //播放下一个
  nextAudio() {
    // 切换之前先保存一下标注
    this.validationLabel()
    let { swiperCurrent, list } = this.data
    if (swiperCurrent >= (list.length - 1)) {
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
    // 兼容组件事件（e.detail）和原生事件（e.currentTarget.dataset）
    let idx = e.detail?.idx ?? e.currentTarget?.dataset?.idx
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
  //停止播放
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
    this.overIntensice()
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
    list[swiperCurrent].status = '3'
    wx.setStorageSync('listenings', list)
    this.setData({
      [`list[${swiperCurrent}].label`]: detail.value,
      [`list[${swiperCurrent}].status`]: '3',
    })
    // 定时
    clearTimeout(inputTimer)
    inputTimer = setTimeout(() => {
      _this.validationLabel()
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
    api.request(this, `/part/v1/sentence`, { ...this.options }, isPull, true).then(res => {
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
      setTimeout(() => wx.navigateBack(), 1500)
    })
  },
  // 标注先期验证
  validationLabel() {
    // 判断是否存在进度ID
    const { progressId } = this.data
    if (!api.isEmpty(progressId)) {
      this.saveSentenceLabel()
    } else {
      this.createProgress()
    }
  },
  // 创建进度后保存标注
  createProgress() {
    api.request(this, '/record/v1/create/progress', { ...this.options }, false, 'POST').then(() => {
      this.saveSentenceLabel()
    }).catch(() => {
      // 创建进度静默失败
    })
  },
  // 保存句子标注
  saveSentenceLabel() {
    const { progressId, swiperCurrent, list } = this.data
    api.request(this, '/record/v1/save/label', {
      progressId: progressId,
      sentenceId: list[swiperCurrent].id,
      status: list[swiperCurrent].status,
      content: list[swiperCurrent].label,
      currentIndex: swiperCurrent
    }, false, 'POST').catch(() => {
      // 保存标注静默失败
    })
  },
  // 保存句子播放状态
  saveSentencePlayingRecord() {
    const { swiperCurrent, list } = this.data
    const state = list[swiperCurrent].status
    list[swiperCurrent].status = state == '0' ? '1' : state
    wx.setStorageSync('listenings', list)
    this.setData({
      [`list[${swiperCurrent}].status`]: state == '0' ? '1' : state,
    })
    api.request(this, '/record/v1/sentence/playing', {
      ...this.options,
      sentenceId: list[swiperCurrent].id
    }, false, 'POST').catch(() => {
      // 播放记录静默失败
    })
  },
  // 完成精听
  overIntensice() {
    const { progressId } = this.data
    // 保存一下最后一个句子的标注
    this.saveSentenceLabel()
    // 提交完成状态
    api.request(this, `/record/v1/complete/progress/${this.data.progressId}`, {}, false).then(() => {
      wx.redirectTo({
        url: '../intensive-notes/index' + api.parseParams({
          ...this.options,
          progressId: progressId,
        }),
      })
    }).catch(() => {
      // 完成失败提示重试
    })
  }
})