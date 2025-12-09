/**
 * tap-action 组件
 * 通用点击动效组件，封装点击反馈效果
 * 支持按钮模式和卡片模式
 */
const app = getApp()

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    // 类型：button（默认，应用按钮样式）/ card（仅点击动效）
    type: {
      type: String,
      value: 'button'
    },
    // icon 名称，自动映射颜色（仅 button 模式有效）
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
