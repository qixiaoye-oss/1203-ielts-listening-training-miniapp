const api = getApp().api

Page({
  data: {
    list: [],
    detail: null,
    isPc: false,
    showDetail: false,
    isAllRady: false
  },
  onLoad(options) {
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
    wx.showLoading({ title: '准备中...' })
    api.request(this, '/record/v1/list/label', {
      ...this.options
    }, true).then(() => {
      this.setData({ isAllRady: true })
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
  editRecord(answer) {
    api.request(this, '/record/v1/save/revise', answer, false, 'post').then(() => {
      api.toast('保存成功')
    })
  },
  returnPage() {
    wx.navigateBack()
  },
  // 打卡功能
  review() {
    // TODO: 实现打卡逻辑
    api.toast('打卡功能待实现')
  }
})