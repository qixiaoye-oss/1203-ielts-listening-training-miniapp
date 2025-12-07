/**
 * btn-action-icon 组件
 * 纯图标按钮，自动封装点击动效
 */
const app = getApp()

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    // icon 名称，自动映射颜色（如 save, play, correct 等）
    icon: {
      type: String,
      value: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    }
  },
  data: {},
  methods: {
    onTap(e) {
      if (this.properties.disabled) return
      this.triggerEvent('tap', e.detail)
    }
  }
})
