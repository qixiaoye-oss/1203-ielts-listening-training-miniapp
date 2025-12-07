const api = getApp().api
const audioApi = getApp().audioApi

// 获取时间（兼容 startTime/endTime 和 startTimeMillis/endTimeMillis）
function getTimeInSeconds(item, type) {
  if (type === 'start') {
    if (item.startTimeMillis !== undefined) {
      return audioApi.millis2Seconds(item.startTimeMillis)
    }
    return item.startTime || 0
  } else {
    if (item.endTimeMillis !== undefined) {
      return audioApi.millis2Seconds(item.endTimeMillis)
    }
    return item.endTime || 0
  }
}

Component({
  properties: {
    list: Array,
    audioSrc: String
  },
  data: {
    showHidden: false,
    nowPlayAudio: -1,
    nowPalySmallAudio: -1,
    audioEndTime: 0
  },
  lifetimes: {
    attached() {
      this.audioContext = wx.createInnerAudioContext()
      // 使用 audioApi.initAudio 下载后存储的临时音频路径
      const src = wx.getStorageSync('tempAudioUrl')
      if (src) {
        this.audioContext.src = src
      }
      this.audioContext.onError((err) => {
        if (audioApi && audioApi.audioErr) {
          audioApi.audioErr(err, this.audioContext.src)
        }
        wx.showModal({
          title: '',
          content: '音频加载失败，请稍后重试',
          showCancel: false
        })
      })
      this.audioContext.onEnded(() => {
        this.setData({
          nowPlayAudio: -1,
          nowPalySmallAudio: -1,
        })
      })
      this.audioContext.onTimeUpdate(() => {
        const { audioEndTime } = this.data
        this.setSentencePlayingStatus()
        if (this.audioContext.currentTime >= audioEndTime && audioEndTime != 0 && this.audioContext.currentTime != 0) {
          this.stopAudio()
        }
      })
    },
    detached() {
      if (this.audioContext && !this.audioContext.paused) {
        this.audioContext.stop()
      }
    },
  },
  observers: {
    'audioSrc': function (val) {
      if (val && this.audioContext) {
        this.audioContext.src = val
      }
    }
  },
  methods: {
    // 点击小句子播放分段音频
    listenSentenceAgain(e) {
      const { list } = this.data
      const { pidx, cidx } = e.currentTarget.dataset
      if (!list[pidx] || !list[pidx].list || !list[pidx].list[cidx]) {
        return
      }
      if (this.audioContext && !this.audioContext.paused) {
        this.audioContext.stop()
      }
      const sentenceData = list[pidx].list[cidx]
      const startTime = getTimeInSeconds(sentenceData, 'start')
      const endTime = getTimeInSeconds(sentenceData, 'end')
      this.audioContext.seek(startTime)
      this.audioContext.startTime = startTime
      this.setData({
        nowPlayAudio: pidx,
        nowPalySmallAudio: cidx,
        audioEndTime: endTime
      })
      wx.nextTick(() => {
        this.audioContext.play()
      })
    },
    // 点击播放整句
    playAudio(e) {
      const { index } = e.currentTarget.dataset
      const { value } = e.target.dataset
      const { list } = this.data
      if (this.audioContext && !this.audioContext.paused) {
        this.audioContext.stop()
        this.setData({
          nowPlayAudio: -1,
          nowPalySmallAudio: -1,
        })
      }
      if (value == 'play') {
        this.closeAllAgainFun()
        const startTime = getTimeInSeconds(list[index], 'start')
        const endTime = getTimeInSeconds(list[index], 'end')
        this.audioContext.seek(startTime)
        this.audioContext.startTime = startTime
        this.audioContext.play()
        this.setData({
          [`list[${index}].againFun`]: true,
          nowPlayAudio: index,
          audioEndTime: endTime
        })
      }
    },
    // 停止音频
    stopAudio() {
      if (this.audioContext) {
        this.audioContext.stop()
      }
      this.setData({
        nowPlayAudio: -1,
        nowPalySmallAudio: -1,
      })
    },
    // 关闭所有再次复习按钮
    closeAllAgainFun() {
      let { list } = this.data
      list.forEach(item => {
        item.againFun = false
      })
      this.setData({ list })
    },
    // 计算播放到哪个小句子（高亮显示）
    setSentencePlayingStatus() {
      let { list, nowPlayAudio } = this.data
      if (nowPlayAudio < 0 || !list[nowPlayAudio] || !list[nowPlayAudio].list) {
        return
      }
      let smallSentence = list[nowPlayAudio].list
      for (let i = 0; i < smallSentence.length; i++) {
        const ele = smallSentence[i]
        const startTime = getTimeInSeconds(ele, 'start')
        const endTime = getTimeInSeconds(ele, 'end')
        if (this.audioContext.currentTime >= (startTime - 0.1) && this.audioContext.currentTime <= endTime) {
          this.setData({ nowPalySmallAudio: i })
        }
        if (this.audioContext.currentTime >= (startTime - 0.1) && endTime == 0) {
          this.setData({ nowPalySmallAudio: i })
        }
      }
    },
    // 前往编辑页
    toEditPage(e) {
      if (this.audioContext && !this.audioContext.paused) {
        this.audioContext.stop()
        this.setData({
          nowPlayAudio: -1,
          nowPalySmallAudio: -1,
        })
      }
      const { item } = e.currentTarget.dataset
      this.triggerEvent('edit', item)
    },
    // 设置菜单（隐藏/显示句子）
    operation(e) {
      const _this = this
      const { index, hidden } = e.currentTarget.dataset
      let menuList = [`${hidden == 1 ? '取消' : ''}隐藏句子`]
      wx.showActionSheet({
        itemList: menuList,
        success() {
          let nowHidden = hidden == 1 ? 0 : 1
          _this.setData({
            [`list[${index}].hidden`]: nowHidden
          })
          _this.editLabel(index, { isHidden: nowHidden })
        }
      })
    },
    // 显示/隐藏原文
    showContent(e) {
      const { index } = e.currentTarget.dataset
      const { list } = this.data
      this.setData({
        [`list[${index}].show`]: !list[index].show,
      })
    },
    // 复习状态切换
    againButChange(e) {
      const { index } = e.currentTarget.dataset
      const { value } = e.target.dataset
      this.setData({
        [`list[${index}].status`]: value,
      })
      this.editLabel(index, { reviewStatus: value })
    },
    // API 请求更新标注
    editLabel(index, param) {
      const { list } = this.data
      if (api && api.request) {
        api.request(this, '/intensiveListening/editLabelRecord', {
          id: list[index].id,
          ...param
        }, false, "POST")
      }
    },
    // 显示/隐藏已隐藏的句子
    showHidden() {
      const { showHidden } = this.data
      this.setData({
        showHidden: !showHidden
      })
    }
  }
})
