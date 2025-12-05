const api = getApp().api
Component({
  properties: {
    detail: Object,
    audioSrc: String,
  },
  data: {
    formats: {},
    editorCtx: null,
    editorKey: true,
    showPl: true
  },
  lifetimes: {
    attached() {
    }
  },
  observers: {
    // 正确监听写法（注意这里是对象属性路径）
    'detail.reviseContent': function (val) {
      // 销毁富文本编辑器
      this.setData({ editorKey: false, formats: {} })
      setTimeout(() => {
        // 创建新的富文本编辑器
        this.setData({ editorKey: true })
      }, 50);
    },
  },
  methods: {
    // 保存并返回
    saveUserAnswer() {
      const { editorCtx, detail } = this.data
      editorCtx.getContents({
        success: (res) => {
          this.triggerEvent('ok', { ...res, id: detail.id })
        }
      })
    },
    // 富文本编辑器准备完毕
    onEditorReady() {
      const { detail } = this.data
      const _this = this
      wx.createSelectorQuery().in(this).select('#editor').context(function (res) {
        if (!res) {
          return
        }
        const editorCtx = res.context
        // 设定默认样式，1.4倍行距
        editorCtx.setContents({
          delta: {
            ops: [{
              insert: '\n',
              attributes: {
                'line-height': '1.4em', // 明确单位
                'paragraph': true // 确保段落结构
              }
            }]
          }
        })
        if (detail.reviseContent) {
          // 当存在内容时直接赋值到富文本编辑器中，因为是直接赋值渲染所以不会出现<P>不换行的问题
          editorCtx.setContents({
            html: detail.reviseContent
          })
        }
        _this.setData({ editorCtx })
        wx.nextTick(() => {
          _this.textareaBlur()
        })
      }).exec()
    },
    // 设定样式
    format(e) {
      const { editorCtx } = this.data
      let { name, value } = e.target.dataset
      if (!name) return
      editorCtx.format(name, value)
    },
    // 删除所有样式
    removeFormat() {
      const { editorCtx } = this.data
      editorCtx.removeFormat()
    },
    onStatusChange(e) {
      const formats = e.detail
      this.setData({ formats })
    },
    textareaFocus() {
      const { formats, editorCtx } = this.data
      // 设置行距
      // if (!formats.hasOwnProperty("lineHeight")) {
      // console.log('设置行距')
      // editorCtx.format('lineHeight', '1.4em')
      // this.editorCtx.blur()
      // }
      this.setData({
        showPl: false
      })
    },
    textareaBlur() {
      const _this = this
      const { editorCtx, formats } = this.data
      editorCtx.getContents({
        success: (res) => {
          _this.setData({ showPl: api.isEmpty(res.text.trim()) })
        }
      })
    },
    setEditorContent() {
      const { editorCtx, detail, formats } = this.data
      editorCtx.setContents({
        // delta: JSON.parse(detail.reviseContent)
        html: detail.reviseContent
      })
      this.textareaBlur()
    },
  }
})