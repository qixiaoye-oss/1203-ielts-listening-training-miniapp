/**
 * 骨架屏组件
 * 用于在内容加载时显示占位轮廓，提升用户感知体验
 *
 * 使用方式：
 * <skeleton type="list" loading="{{loading}}" rows="5" />
 * <view wx:if="{{!loading}}">正常内容</view>
 *
 * 预设类型：
 * - list: 列表骨架（默认）
 * - card: 卡片骨架
 * - detail: 详情骨架
 * - user: 用户信息骨架
 */
Component({
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {
    /**
     * 是否显示骨架屏
     */
    loading: {
      type: Boolean,
      value: true
    },

    /**
     * 骨架屏类型
     * list | card | detail | user
     */
    type: {
      type: String,
      value: 'list'
    },

    /**
     * 行数（list/card 类型有效）
     */
    rows: {
      type: Number,
      value: 3
    },

    /**
     * 是否显示头像（list 类型有效）
     */
    avatar: {
      type: Boolean,
      value: false
    },

    /**
     * 头像形状：circle | square
     */
    avatarShape: {
      type: String,
      value: 'circle'
    },

    /**
     * 是否显示标题（list 类型有效）
     */
    title: {
      type: Boolean,
      value: true
    },

    /**
     * 是否开启动画
     */
    animate: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 生成行数数组，用于 wx:for
    rowsArray: []
  },

  observers: {
    'rows': function(rows) {
      this.setData({
        rowsArray: new Array(rows).fill(0)
      })
    }
  },

  lifetimes: {
    attached() {
      this.setData({
        rowsArray: new Array(this.data.rows).fill(0)
      })
    }
  }
})
