# 按钮点击动效复用指南

## 概述

本项目提供两种方式实现按钮点击动效：
1. **组件方式**（推荐）：使用 `btn-action` / `btn-action-icon` 组件
2. **类名方式**：直接使用 CSS 类名 + `hover-class`

---

## 方式一：组件方式（推荐）

### 全局注册

组件已在 `app.json` 中全局注册，无需在页面中单独引入：

```json
{
  "usingComponents": {
    "btn-action": "/components/btn-action/index",
    "btn-action-icon": "/components/btn-action-icon/index"
  }
}
```

### 使用示例

#### btn-action（带文字按钮）

```xml
<btn-action type="audio" bind:tap="onPlay">
  <text>播放</text>
  <image src="/images/play.png"></image>
</btn-action>

<btn-action type="correct" bind:tap="onSubmit">
  <text>提交</text>
  <image src="/images/correct.png"></image>
</btn-action>

<!-- 禁用状态 -->
<btn-action type="audio" disabled="{{true}}">
  <text>禁用</text>
</btn-action>
```

#### btn-action-icon（纯图标按钮）

```xml
<btn-action-icon type="setting" bind:tap="onSetting">
  <image src="/images/setting.png"></image>
</btn-action-icon>

<btn-action-icon type="visible" bind:tap="onToggle">
  <image src="/images/visible.png"></image>
</btn-action-icon>
```

### 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | String | '' | 功能色彩类型 |
| disabled | Boolean | false | 是否禁用 |

### type 可选值

| 值 | 颜色 | 用途 |
|---|------|------|
| audio | #00A6ED 蓝色 | 音频播放 |
| correct | #00D26A 绿色 | 正确确认 |
| wrong | #F92F60 红色 | 错误删除 |
| list | #FFB02D 黄色 | 列表导航 |
| setting | #998EA4 紫灰 | 设置配置 |
| visible | #7D4533 棕色 | 显示隐藏 |
| label | #F8312F 红色 | 标记标签 |
| recording | #212121 黑色 | 录音相关 |
| practice | #433B6B 深紫 | 练习模式 |
| exercise | #533566 紫色 | 习题练习 |

---

## 方式二：类名方式

适用于需要更灵活控制的场景，或非按钮元素（如卡片）。

### 使用示例

```xml
<!-- 按钮 -->
<view
  class="btn-action btn--audio"
  hover-class="tap-active"
  hover-stay-time="100"
  bindtap="onPlay"
>
  <text>播放</text>
  <image src="/images/play.png"></image>
</view>

<!-- 纯图标按钮 -->
<view
  class="btn-action-icon btn--setting"
  hover-class="tap-active"
  hover-stay-time="100"
  bindtap="onSetting"
>
  <image src="/images/setting.png"></image>
</view>

<!-- 卡片（非按钮元素也可使用动效） -->
<view
  class="my-card"
  hover-class="tap-active"
  hover-stay-time="100"
  bindtap="onCardTap"
>
  卡片内容
</view>
```

### 关键属性

| 属性 | 值 | 说明 |
|------|---|------|
| hover-class | "tap-active" | 点击时应用的类名 |
| hover-stay-time | "100" | 动效保持时间（毫秒） |

---

## 动效说明

### tap-active（点击动效）

```css
.tap-active {
  opacity: 0.7;              /* 透明度降至70% */
  transform: scale(0.98);    /* 缩放至98% */
  transition: all 0.1s ease-out;  /* 100ms缓出动画 */
}
```

### btn--shake（晃动动画）

用于吸引用户注意力，可手动添加到需要的元素：

```xml
<view class="btn-action btn--audio btn--shake">
  需要注意的按钮
</view>
```

```css
.btn--shake {
  animation: btn-shake 0.6s ease-in-out;
}
```

---

## 两种方式对比

| 对比项 | 组件方式 | 类名方式 |
|--------|---------|---------|
| 代码简洁度 | ✅ 更简洁 | 需要写 hover-class 和 hover-stay-time |
| 灵活性 | 固定结构 | ✅ 更灵活 |
| 适用场景 | 标准按钮 | 按钮、卡片、任意可点击元素 |
| 动效封装 | ✅ 自动封装 | 需手动添加 |

---

## 完整按钮组示例

```xml
<!-- 固定底部按钮组 -->
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <!-- 上层 -->
    <view class="btn-group-layout-split__header">
      <btn-action type="audio" bind:tap="onReplay">
        <text>重播</text>
        <image src="/images/replay.png"></image>
      </btn-action>
      <btn-action type="correct" bind:tap="onConfirm">
        <text>确认</text>
        <image src="/images/correct.png"></image>
      </btn-action>
    </view>

    <!-- 分割线 -->
    <view class="btn-group-layout-split__divider"></view>

    <!-- 下层 -->
    <view class="btn-group-layout-split__footer">
      <btn-action-icon type="setting" bind:tap="onSetting">
        <image src="/images/setting.png"></image>
      </btn-action-icon>
      <btn-action type="list" bind:tap="onList">
        <text>列表</text>
        <image src="/images/list.png"></image>
      </btn-action>
    </view>
  </view>
</view>
```

---

## 文件结构

```
components/
├── btn-action/           # 带文字按钮组件
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
└── btn-action-icon/      # 纯图标按钮组件
    ├── index.js
    ├── index.json
    ├── index.wxml
    └── index.wxss

style/
└── button-group.wxss     # 按钮组样式（含动效）

docs/
├── button-group-style-guide.md  # 按钮组规范
└── button-effect-reuse.md       # 本文档
```

---

**文档版本：** v1.0
**更新日期：** 2025-12-06
