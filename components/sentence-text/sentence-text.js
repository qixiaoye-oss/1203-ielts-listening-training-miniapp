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
    // 讲述人名称（可选）
    narrator: {
      type: String,
      value: ''
    },
    // 讲述人性别：'1' 男性，'2' 女性
    narratorSex: {
      type: String,
      value: '1'
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
