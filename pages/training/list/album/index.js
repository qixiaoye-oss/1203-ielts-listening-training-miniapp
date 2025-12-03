const api = getApp().api
const loadingProgress = require('../../../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  data: {},
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
    api.request(this, '/module/v1/list', {
      ...this.options
    }, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
    })
  },
  // ===========数据获取 End===========
})
