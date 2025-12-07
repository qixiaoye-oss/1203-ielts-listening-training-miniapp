Component({
  properties: {
    // 文本内容
    content: {
      type: String,
      value: ''
    },
    // 是否激活状态
    active: {
      type: Boolean,
      value: false
    },
    // 元素 id（用于滚动定位）
    textId: {
      type: String,
      value: ''
    },
    // 索引（用于事件回传）
    index: {
      type: Number,
      value: 0
    }
  },
  methods: {
    handleTap(e) {
      this.triggerEvent('tap', {
        index: this.data.index,
        ...e.currentTarget.dataset
      })
    }
  }
})
