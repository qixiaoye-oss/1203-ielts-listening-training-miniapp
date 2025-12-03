const api = getApp().api
const loadingProgress = require('../../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  data: {},
  onLoad() {
    this.startLoading()
    this.listResourceStatus()
  },
  listResourceStatus() {
    api.request(this, '/user/listUserOpenResource', {
      userId: api.getUserId(),
    }, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
    })
  },
  resourceChange(e) {
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    api.request(this, '/user/updateUserOpenResource', {
      userId: api.getUserId(),
      id: item.id,
      isShow: e.detail.value ? 1 : 0
    }, true, 'post').then(res => {
      let path = `list[` + index + `].isShow`
      this.setData({
        [path]: e.detail.value ? 1 : 0
      })
    })
  }
})