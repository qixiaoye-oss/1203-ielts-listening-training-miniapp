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
  // 去往答题
  toWriting(e) {
    const { moduleIndex, unitIndex } = e.currentTarget.dataset
    const { list } = this.data
    const { subjectId } = this.options
    const item = list[moduleIndex].list[unitIndex]
    if (!this.verifyPermissions(item)) {
      return
    }
    let param = `?unitId=${item.id}&moduleId=${list[moduleIndex].id}&subjectId=${subjectId}`
    this.createActionSheet(item, param)
  },
  // 权限验证
  verifyPermissions(item) {
    const user = wx.getStorageSync('user')
    // if (api.isEmpty(user.nickName)) {
    //   wx.navigateTo({
    //     url: '/pages/setting/user/index',
    //   })
    //   return false
    // }
    if (item.isInside === '0') {
      api.modal('', '暂无权限', false)
      return false
    }
    return true
  },
  createActionSheet(item, param) {
    const menus = ['泛听/做题模式']
    const menuUrls = [`/pages/training/listening/extensive/index${param}`]
    const parts = item.list || []
    parts.forEach(part => {
      menus.push(`精听模式（${part.partNum}）`)
      menuUrls.push(`/pages/training/listening/intensive/index${param}&partId=${part.id}`)
    })
    if (item.resultId) {
      menus.push(`答题记录`)
      menuUrls.push(`/pages/training/listening/report-card/index?resultId=${item.resultId}`)
    }
    wx.showActionSheet({
      itemList: menus,
      success(res) {
        wx.navigateTo({
          url: menuUrls[res.tapIndex],
        })
      }
    })
  },
  // 跳转到设置页面
  toPage() {
    const { subjectId, albumId } = this.options
    wx.navigateTo({
      url: `/pages/training/setting/set/index?subjectId=${subjectId}&albumId=${albumId}`,
    })
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  listData() {
    api.request(this, '/unit/v1/list', {
      ...this.options
    }, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
    })
  },
  // ===========数据获取 End===========
})
