const audioApi = getApp().audioApi
const pageLoading = require('../../../../behaviors/pageLoading.js')

let audio
Page({
  behaviors: [pageLoading],
  data: {
    endTime: 0,
    stauts: 0,
    scrollIntoId: ''
  },
  onLoad(options) {
    const _this = this
    this.startLoading()
    setTimeout(() => {
      _this.setData({
        scrollIntoId: "ID" + _this.options.paragraphId
      })
    }, 200);
    _this.finishLoading()
  },
  onShow() {
    let list = wx.getStorageSync('listenings')
    list.forEach(i => {
      i['audioPlay'] = "stop"
    })
    this.setData({
      list: list
    })
    audio = wx.createInnerAudioContext()
    audio.src = wx.getStorageSync('tempAudioUrl')
    audio.onTimeUpdate(() => {
      let currentTime = Math.floor(audio.currentTime * 100) / 100
      let endTime = this.data.endTime
      if (endTime > 0 && currentTime > (endTime - 0.50)) {
        audio.stop()
        this.audioStop()
      }
    })
  },
  audioStop() {
    let list = this.data.list
    list.forEach(i => {
      i['audioPlay'] = "stop"
    })
    this.setData({
      list: list
    })
  },
  playAudio(e) {
    // iaudio.stop()
    audio.stop()
    this.audioStop()
    let list = this.data.list
    let len = list.length
    let nextIdx = e.currentTarget.dataset.idx
    let endTime
    if (nextIdx < (len - 1)) {
      endTime = audioApi.millis2Seconds(list[nextIdx + 1].list[0].startTimeMillis)
    }
    this.setData({
      endTime: endTime,
      stauts: 1
    })
    let startTime = audioApi.millis2Seconds(list[nextIdx].list[0].startTimeMillis)
    if (nextIdx > 0 && startTime <= 0) {
      startTime = audioApi.millis2Seconds(list[nextIdx].list[0].startTimeMillis)
    }
    audio.startTime = startTime
    audio.seek(startTime)
    console.log('音频播放开始时间：', startTime);
    list[nextIdx].audioPlay = 'play'
    this.setData({
      list: list
    })
    setTimeout(() => {
      audio.play()
    }, 500);
  },
  onHide() {
    audio.destroy()
  },
  onUnload() {
    audio.destroy()
  },
  toDetail(e) {
    let pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      index: e.currentTarget.dataset.idx
    })
    // iaudio.stop()
    wx.navigateBack({})
  },
})