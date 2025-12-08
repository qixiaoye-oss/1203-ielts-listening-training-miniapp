const api = getApp().api
const pageLoading = require('../../../../behaviors/pageLoading.js')

Page({
  behaviors: [pageLoading],
  data: {
    loadError: false
  },
  // ===========生命周期 Start===========
  onShow() {
    this.startLoading()
    this.listData()
  },
  onShareAppMessage() {
    return api.share('不刷语料库', this)
  },
  // ===========生命周期 End===========
  // ===========业务操作 Start===========
  toPage() {
    const {
      subjectId
    } = this.options
    wx.navigateTo({
      url: `/pages/training/setting/album/index?subjectId=${subjectId}`,
    })
  },
  toChapter({
    currentTarget: {
      dataset: {
        id
      }
    }
  }) {
    const {
      subjectId
    } = this.options
    wx.navigateTo({
      url: `../set/index?moduleId=${id}&subjectId=${subjectId}`
    })
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  listData() {
    this.setData({ loadError: false })
    api.request(this, '/module/v1/list', {
      ...this.options
    }, true).then(() => {
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
