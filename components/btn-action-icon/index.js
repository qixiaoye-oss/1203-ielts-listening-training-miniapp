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
    // 功能色彩类型：audio, correct, wrong, list, setting, visible, label, recording, practice, exercise
    type: {
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
