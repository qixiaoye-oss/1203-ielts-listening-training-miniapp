const api = getApp().api
const loadingProgress = require('../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  data: {
    version: '1.4.37',
  },
  onShow: function () {
    api.getUser(this)
    this.startLoading()
    this.listData(false)
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
      url: '/pages/setting/user/index',
    })
  },
  // 首页显示内容
  updataHome() {
    wx.navigateTo({
      url: '/pages/setting/module/index',
    })
  },
  // 用户权限管理
  toUpdateAuth() {
    wx.navigateTo({
      url: '/pages/teacher/widget/index',
    })
  },
  // 查看权限有效期
  showRole() {
    this.setData({
      showPopup: true
    })
  },
  // 切换用户
  checkUser() {
    const _this = this
    wx.showModal({
      title: '切换用户',
      editable: true,
      placeholderText: '请输入用户ID',
      complete: (res) => {
        if (res.confirm && res.content) {
          _this.listUser(res.content)
        }
      }
    })
  },
  // 接口调用-获取数据
  listData(isPull) {
    api.request(this, '/user/expirationDate', {
      userId: api.getUserId()
    }, isPull).then(res => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
    })
  },
  // 接口调用-修改发音
  updateAudioType(type) {
    api.request(this, '/user/saveUserPronunciationType', {
      uid: api.getUserId(),
      pronunciation: type
    }, false, "post").then(res => {
      wx.setStorageSync('user', res.user)
    })
  },
  // 接口调用-获取用户信息
  listUser(no) {
    api.request(this, '/user/listUserByName', {
      nameOrId: no
    }, true).then(res => {
      let list = res.userList || []
      if (list.length != 1) {
        api.toast("切换失败，用户ID不正确")
      } else {
        let user = wx.getStorageSync('user')
        user.id = list[0].id
        wx.setStorageSync('user', user)
        api.toast("切换成功")
      }
    })
  },

  listData(isPull) {
    api.request(this, '/user/expirationDate', {
      userId: api.getUserId()
    }, isPull).then(res => { })
  },
  showRole() {
    this.setData({
      showPopup: true
    })
  },
  daily() {
    wx.showActionSheet({
      itemList: ["每日听写", "每日解析"],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/daily/task_list/task_list',
          })
        }
        if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '/pages/daily/qa_list/qa_list',
          })
        }
      }
    })
  },

  listUser(no) {
    api.request(this, '/user/listUserByName', {
      nameOrId: no
    }, true).then(res => {
      let list = res.userList || []
      if (list.length != 1) {
        api.toast("切换失败，用户ID不正确")
      } else {
        let user = wx.getStorageSync('user')
        user.id = list[0].id
        wx.setStorageSync('user', user)
        api.toast("切换成功")
      }
    })
  },
})