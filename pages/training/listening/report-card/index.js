const api = getApp().api
const loadingProgress = require('../../../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  data: {},
  // ===========生命周期 Start===========
  onShow() { },
  onLoad: function (options) {
    this.startLoading()
    this.listQuestion(true)
  },
  // ===========生命周期 End===========
  // ===========业务操作 Start===========
  returnPage() {
    const { subjectId, moduleId } = this.options
    wx.redirectTo({
      url: `/pages/training/list/set/index?subjectId=${subjectId}&moduleId=${moduleId}`
    })
  },
  change(e) {
    const { partIndex, groupIndex, questionIndex } = e.currentTarget.dataset
    const { parts } = this.data
    let param = {
      partId: parts[partIndex].id,
      groupId: parts[partIndex].groups[groupIndex].id,
      questionId: parts[partIndex].groups[groupIndex].questions[questionIndex].id
    }
    wx.navigateTo({
      url: '../explanation/index' + api.parseParams(param),
    })
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  listQuestion(isPull) {
    const _this = this
    api.request(this, `/result/v1/result/${this.options.resultId}`, {}, isPull).then(() => {
      _this.finishLoading()
    }).catch(() => {
      _this.finishLoading()
      setTimeout(() => wx.navigateBack(), 1500)
    })
  },
})