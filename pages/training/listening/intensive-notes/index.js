const api = getApp().api
const pageGuard = require('../../../../behaviors/pageGuard')
const pageLoading = require('../../../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],
  data: {
    list: [],
    detail: null,
    isPc: false,
    showDetail: false,
    isAllRady: false
  },
  onLoad(options) {
    this.startLoading()
    this.listData()
  },
  onShow() {
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
    api.request(this, '/record/v1/list/label', {
      ...this.options
    }, true).then(() => {
      this.setData({ isAllRady: true })
      this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(this)
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
      this.setData({
        [`list[${index}].reviseContent`]: detail.html
      })
      this.editRecord({
        id: detail.id,
        reviseContent: detail.html
      })
    }
    this.setData({ showDetail: false })
  },
  editRecord(answer, showToast = true) {
    api.request(this, '/record/v1/save/revise', answer, false, 'post').then(() => {
      if (showToast) {
        api.toast('保存成功')
      }
    }).catch(() => {
      // 保存失败仅提示
    })
  },
  // 实时自动保存
  autoSave({ detail }) {
    const { list } = this.data
    if (detail.id) {
      let index = list.findIndex((i) => i.id === detail.id)
      if (index !== -1) {
        this.setData({
          [`list[${index}].reviseContent`]: detail.html
        })
        this.editRecord({
          id: detail.id,
          reviseContent: detail.html
        }, false) // 静默保存，不显示提示
      }
    }
  },
  returnPage() {
    wx.navigateBack()
  }
})