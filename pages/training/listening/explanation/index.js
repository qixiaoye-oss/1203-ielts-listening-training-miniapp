const api = getApp().api
const pageGuard = require('../../../../behaviors/pageGuard')
const pageLoading = require('../../../../behaviors/pageLoading')
const audioLoading = require('../../../../behaviors/audioLoading')
const audioApi = require('../../../../utils/audioApi')

let audio
Page({
  behaviors: [pageGuard.behavior, pageLoading, audioLoading],
  data: {
    audioPlay: false,
    noReady: true,
    htmlStyle: {
      p: 'margin-bottom:14px'
    },
    showHidden: false
  },
  onLoad: function (options) {
    this.startLoading()
    this.getDetail(true)
  },
  onShow: function () {
    audio = wx.createInnerAudioContext()
    audio.onPlay(() => {
      this.setData({
        audioPlay: true
      })
    })
    audio.onCanplay(() => {
      this.setData({
        noReady: false
      })
    })
    audio.onTimeUpdate(() => {
      const { startTimeMillis, endTimeMillis } = this.data.question
      let startTime = audioApi.millis2Seconds(startTimeMillis)
      let endTime = audio.duration
      if (endTimeMillis != 0) {
        endTime = audioApi.millis2Seconds(endTimeMillis)
      }
      if (audio.currentTime >= endTime) {
        audio.stop()
        audio.startTime = startTime
        audio.seek(startTime)
        this.setData({
          audioPlay: false
        })
      }
    })
    audio.onEnded(() => {
      const { startTimeMillis } = this.data.question
      let startTime = audioApi.millis2Seconds(startTimeMillis)
      audio.stop()
      audio.startTime = startTime
      audio.seek(startTime)
      this.setData({
        audioPlay: false
      })
    })
    audio.onError(res => {
      console.log(res)
    })
  },
  stopAudio() {
    audio.pause()
    this.setData({
      audioPlay: false
    })
  },
  play(e) {
    // if (!this.data.noReady) {
    //   api.toast("音频还没准备好！")
    //   return
    // }
    this.stopAudio()
    audio.play()
  },
  onHide() {
    this.stopAudio()
  },
  onUnload: function () {
    audio.destroy()
    let tempUrl = wx.getStorageSync('tempAudioUrl')
    wx.getFileSystemManager().removeSavedFile({
      filePath: tempUrl
    })
    wx.removeStorageSync('tempAudioUrl')
  },
  showHidden() {
    this.setData({
      showHidden: !this.data.showHidden
    })
  },
  getDetail(isPull) {
    const _this = this
    api.request(this, '/question/v1/analysis/question/miniapp', { ...this.options }, isPull).then(res => {
      let startTime = audioApi.millis2Seconds(res.question.startTimeMillis)
      console.log(res)
      audio.src = res.audioUrl
      audio.startTime = startTime
      audio.seek(startTime)
      _this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  },
  checkImg(e) {
    wx.previewImage({
      urls: [this.data.detail.imageUrl],
    })
  },
})