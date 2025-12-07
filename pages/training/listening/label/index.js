const api = getApp().api
const audioApi = getApp().audioApi

Page({
  data: {
    list: [],
    detail: {
      reviseContent: '<p style="line-height: 1.4em;">第一行标注</p><p style="line-height: 1.4em;">第二行标注</p>'
    },
    isPc: false,
    showDetail: false,
    isAllRady: false,
    audioDownProgress: 100 // 音频下载进度（100表示无需显示加载）
  },
  onLoad(options) {
    this.listData()
  },
  onShow() {
    // 检测PC环境
    // const { platform, model } = wx.getDeviceInfo()
    // const { deviceOrientation } = wx.getSystemSetting()
    // if (platform === 'windows' || platform === 'mac') {
    //   this.setData({ isPc: true })
    // }
    // if (model.toLowerCase().indexOf('pad') > -1 && deviceOrientation == 'landscape') {
    //   this.setData({ isPc: true })
    // }
    this.isOpenPc()
  },
  onResize() {
    this.isOpenPc()
  },
  isOpenPc() {
    const { windowWidth, windowHeight } = wx.getWindowInfo()
    let flag = (windowWidth / windowHeight) > 1
    this.setData({
      isPc: flag,
    })
  },
  // 获取数据
  listData() {
    const _this = this
    // 设置超时保护，防止请求无响应导致页面一直空白
    const timeoutId = setTimeout(() => {
      if (!_this.data.isAllRady) {
        _this.setData({ isAllRady: true, audioDownProgress: 100 })
      }
    }, 10000) // 10秒超时

    api.request(this, '/record/v1/list/label', {
      ...this.options
    }, false).then((res) => {
      clearTimeout(timeoutId)
      // API 会自动将数据绑定到 this.data，所以检查 this.data.audioUrl 或 res.audioUrl
      const audioUrl = (res && res.audioUrl) || _this.data.audioUrl
      if (audioUrl) {
        audioApi.initAudio(audioUrl, (progress) => {
          _this.setData({ audioDownProgress: progress })
        }).then(() => {
          _this.setData({ isAllRady: true, audioDownProgress: 100 })
        }).catch(() => {
          _this.setData({ isAllRady: true, audioDownProgress: 100 })
        })
      } else {
        // 没有音频URL，直接显示内容
        _this.setData({ isAllRady: true, audioDownProgress: 100 })
      }
    }).catch(() => {
      clearTimeout(timeoutId)
      _this.setData({ isAllRady: true, audioDownProgress: 100 })
    })
  },
  toEditPage({ detail }) {
    let { list } = this.data
    list.forEach(item => {
      item.active = item.id === detail.id
    });
    this.setData({ detail, showDetail: true, list })
  },
  editOver({ detail }) {
    const { list } = this.data
    if (detail.errMsg == 'ok') {
      let index = list.findIndex((i) => i.id === detail.id)
      // console.log(detail)
      // const deltaStr = JSON.stringify(detail.delta)
      this.setData({
        [`list[${index}].reviseContent`]: detail.html
      })
      this.editRecord({
        id: detail.id,
        reviseContent: detail.html
      })
    }
    this.setData({
      showDetail: false
    })
  },
  editRecord(answer) {
    console.log(answer)
    api.request(this, '/record/v1/save/revise', answer, false, "post").then(() => {
      api.toast("保存成功")
    })
  },
  returnPage() {
    wx.navigateBack()
  },
})