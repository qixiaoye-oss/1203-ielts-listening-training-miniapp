const api = getApp().api
const pageLoading = require('../../../behaviors/pageLoading')

Page({
  behaviors: [pageLoading],
  data: {
    uselessCount: 0,
    usefulCount: 0
  },
  // ===========生命周期 Start===========
  onShow() {
    this.startLoading()
    this.listData()
  },
  // ===========生命周期 End===========
  // ===========业务操作 Start===========
  // 有用
  useful() {
    if (this.data.usefulCount >= 1) {
      return
    }
    this.setData({
      usefulCount: 1,
      uselessCount: 0
    })
    this.lable('useful')
  },
  // 无用
  useless() {
    if (this.data.uselessCount >= 1) {
      return
    }
    this.setData({
      usefulCount: 0,
      uselessCount: 1
    })
    this.lable('useless')
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  // 访问接口获取数据
  listData() {
    api.request(this, `/popular/science/v1/detail//${this.options.id}`, {}, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
      setTimeout(() => wx.navigateBack(), 1500)
    })
  },
  lable(type) {
    api.request(this, `/popular/science/v1/label/${type}/${this.options.id}`, {}, true).then(() => {
      api.toast('感谢反馈')
    }).catch(() => {
      // 点赞失败仅提示，已在 api.js 中 toast
    })
  },
  // ===========数据获取 End===========
})
