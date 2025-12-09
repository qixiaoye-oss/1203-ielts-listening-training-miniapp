/**
 * btn-action 组件
 * 通用按钮组件，自动封装点击动效
 * 支持带文字按钮和纯图标按钮两种模式
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
    },
    // 是否为纯图标模式（原 btn-action-icon）
    iconOnly: {
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
