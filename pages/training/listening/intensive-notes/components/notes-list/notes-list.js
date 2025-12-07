const api = getApp().api

Component({
  properties: {
    list: Array
  },
  data: {
    nowPlayAudio: -1,
    nowPalySmallAudio: -1,
    showHidden: false
  },
  methods: {
    // 前往编辑
    toEditPage(e) {
      const { item } = e.currentTarget.dataset
      this.triggerEvent('edit', item)
    },
    // 播放音频
    playAudio(e) {
      const { index } = e.currentTarget.dataset
      const { nowPlayAudio } = this.data
      if (nowPlayAudio === index) {
        this.setData({ nowPlayAudio: -1 })
      } else {
        // TODO: 实现音频播放逻辑
        this.setData({ nowPlayAudio: index })
      }
    },
    // 显示/隐藏内容
    showContent(e) {
      const { index } = e.currentTarget.dataset
      const list = this.properties.list
      list[index].show = !list[index].show
      this.setData({ list })
    },
    // 设置操作
    operation(e) {
      const { index, hidden } = e.currentTarget.dataset
      // TODO: 实现设置操作（如隐藏/显示此项）
    },
    // 切换显示隐藏项
    showHidden() {
      this.setData({ showHidden: !this.data.showHidden })
    },
    // 复习状态切换
    againButChange(e) {
      const { index } = e.currentTarget.dataset
      const { value } = e.target.dataset
      const list = this.properties.list
      list[index].status = value
      this.setData({ list })
    },
    // 打卡
    review() {
      this.triggerEvent('review')
    }
  }
})
