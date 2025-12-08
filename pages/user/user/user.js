const api = getApp().api
const loadingProgress = require('../../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  data: {
    version: '1.4.37',
    loadError: false
  },
  onShow: function () {
    this.getUser(this)
    this.startLoading()
    const systemInfo = wx.getSystemInfoSync();
    const tabBarHeight = systemInfo.windowHeight - systemInfo.statusBarHeight;
    const miniProgram = wx.getAccountInfoSync();
    this.setData({
      version: miniProgram.miniProgram.version,
      bottom: tabBarHeight - 90
    })
  },
  onShareAppMessage: function () {
    return api.share('用户中心', this)
  },
  toUpdateUserInfo() {
    wx.navigateTo({
      url: '/pages/user/login/login',
    })
  },
  getUser() {
    this.setData({ loadError: false })
    api.request(this, '/user/v1/user/info', {}, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
      this.setData({ loadError: true })
    })
  },
  // 重试加载
  retryLoad() {
    this.startLoading()
    this.getUser()
  }
})