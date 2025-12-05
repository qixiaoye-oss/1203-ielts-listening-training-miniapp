const api = getApp().api
let audioContext
Component({
  properties: {
    list: Array
  },
  methods: {
    // 前往编辑
    toEditPage(e) {
      const { item } = e.currentTarget.dataset
      this.triggerEvent('edit', item)
    },
    returnPage() {
      this.triggerEvent('return', item)
    }
  }
})