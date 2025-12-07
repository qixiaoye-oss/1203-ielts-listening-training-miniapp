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
    isAllRady: false
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
    wx.showLoading({
      title: '准备中...',
    })
    api.request(this, '/record/v1/list/label', {
      ...this.options
    }, true).then((res) => {
      // 初始化音频（使用与 intensive 页面相同的方式）
      if (res && res.audioUrl) {
        audioApi.initAudio(res.audioUrl).then(() => {
          _this.setData({ isAllRady: true })
        }).catch(() => {
          _this.setData({ isAllRady: true })
        })
      } else {
        _this.setData({ isAllRady: true })
      }
    }).catch(() => {
      _this.setData({ isAllRady: true })
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