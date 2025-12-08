const api = getApp().api
const loadingProgress = require('../../../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  data: {
    htmlStyle: {
      p: 'margin-bottom:10px;',
      span: 'line-height: 1.4;font-family: Arial, Helvetica, sans-serif;'
    }
  },
  // ===========生命周期 Start===========
  onLoad: function (options) {
    this.startLoading()
    this.getDetail(true)
  },
  // ===========生命周期 End===========
  // ===========业务操作 Start===========
  returnPage() {
    wx.navigateBack()
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  // 访问接口获取数据
  getDetail(isPull) {
    api.request(this, `/part/v1/article/${this.options.partId}`, {}, isPull, false).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
      setTimeout(() => wx.navigateBack(), 1500)
    })
  }
  // ===========数据获取 End===========
})
