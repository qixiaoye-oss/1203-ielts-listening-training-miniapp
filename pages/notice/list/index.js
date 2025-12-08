const api = getApp().api
const loadingProgress = require('../../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  data: {
    loadError: false
  },
  // ===========生命周期 Start===========
  onShow() {
    this.startLoading()
    this.listData()
  },
  // ===========生命周期 End===========
  // ===========业务操作 Start===========
  // 去往答题
  toDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../detail/index?id=${item.id}`,
    })
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  // 访问接口获取数据
  listData() {
    this.setData({ loadError: false })
    api.request(this, '/popular/science/v1/miniapp/list', {}, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
      this.setData({ loadError: true })
    })
  },
  // 重试加载
  retryLoad() {
    this.startLoading()
    this.listData()
  },
  // ===========数据获取 End===========
})
