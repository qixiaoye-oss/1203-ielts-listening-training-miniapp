const api = getApp().api
let audioContext
Component({
  properties: {
    list: Array,
    audioSrc: String
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
    returnPage() {
      this.triggerEvent('return', item)
    },
    // 播放音频
    playAudio(e) {
      const { index } = e.currentTarget.dataset
      const { nowPlayAudio } = this.data

      if (nowPlayAudio === index) {
        // 当前正在播放，暂停
        if (audioContext) {
          audioContext.pause()
          this.setData({ nowPlayAudio: -1 })
        }
      } else {
        // 播放新音频
        // 注：需要根据实际数据结构获取音频URL
        this.setData({ nowPlayAudio: index })
        // TODO: 实现音频播放逻辑
        console.log('播放音频，索引:', index)
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
      console.log('设置操作，索引:', index, '隐藏状态:', hidden)
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
