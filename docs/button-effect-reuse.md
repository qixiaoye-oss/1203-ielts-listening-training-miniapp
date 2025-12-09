# 点击动效复用指南

## 概述

本项目提供两种方式实现点击动效：
1. **组件方式**（推荐）：使用 `tap-action` 组件
2. **类名方式**：直接使用 CSS 类名 + `hover-class`

---

## 方式一：组件方式（推荐）

### 全局注册

组件已在 `app.json` 中全局注册，无需在页面中单独引入：

```json
{
  "usingComponents": {
    "tap-action": "/components/tap-action/index"
  }
}
```

### 使用示例

#### 按钮模式（默认）

```xml
<!-- 带文字按钮 -->
<tap-action icon="play" bind:tap="onPlay">
  <text>播放</text>
  <image src="/images/play.png"></image>
</tap-action>

<!-- 纯图标按钮 -->
<tap-action icon="setting" bind:tap="onSetting">
  <image src="/images/setting.png"></image>
</tap-action>

<!-- 禁用状态 -->
<tap-action icon="play" disabled="{{true}}">
  <text>禁用</text>
</tap-action>
```

#### 卡片模式

```xml
<!-- 列表卡片 -->
<tap-action type="card" bind:tap="onCardTap">
  <view class="my-card">
    <text>卡片标题</text>
    <text>卡片内容</text>
  </view>
</tap-action>

<!-- 任意可点击元素 -->
<tap-action type="card" bind:tap="onItemTap">
  <view class="list-item">列表项</view>
</tap-action>
```

### 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | String | 'button' | 模式：`button`（按钮样式）/ `card`（仅动效） |
| icon | String | '' | icon 名称，自动映射颜色（仅 button 模式有效） |
| disabled | Boolean | false | 是否禁用 |

### icon 可选值

| 值 | 颜色 | 用途 |
|---|------|------|
| save | #00A6ED 蓝色 | 保存 |
| play | #00A6ED 蓝色 | 音频播放 |
| correct | #00D26A 绿色 | 正确确认 |
| flag | #F8312F 红色 | 标记 |
| list | #FFB02E 黄色 | 列表导航 |
| setting | #998EA4 紫灰 | 设置配置 |
| visible | #7D4533 棕色 | 显示隐藏 |
| me | #533566 紫色 | 个人中心 |

---

## 方式二：类名方式

适用于需要更灵活控制的场景（向后兼容）。

### 使用示例

```xml
<!-- 按钮 -->
<view
  class="btn-action"
  data-icon="play"
  hover-class="tap-active"
  hover-stay-time="100"
  bindtap="onPlay"
>
  <text>播放</text>
  <image src="/images/play.png"></image>
</view>

<!-- 卡片 -->
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

用于吸引用户注意力：

```xml
<tap-action icon="save" class="btn--shake">
  需要注意的按钮
</tap-action>
```

---

## 两种方式对比

| 对比项 | 组件方式 | 类名方式 |
|--------|---------|---------|
| 代码简洁度 | ✅ 更简洁 | 需要写 hover-class 和 hover-stay-time |
| 灵活性 | 固定结构 | ✅ 更灵活 |
| 适用场景 | 按钮、卡片 | 任意可点击元素 |
| 动效封装 | ✅ 自动封装 | 需手动添加 |
| 跨项目复用 | ✅ 复制组件目录即可 | 需复制样式文件 |

---

## 完整按钮组示例

```xml
<!-- 固定底部按钮组 -->
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <!-- 上层 -->
    <view class="btn-group-layout-split__header btn-pos-center">
      <tap-action icon="replay" bind:tap="onReplay">
        <text>重播</text>
        <image src="/images/replay.png"></image>
      </tap-action>
      <tap-action icon="correct" bind:tap="onConfirm">
        <text>确认</text>
        <image src="/images/correct.png"></image>
      </tap-action>
    </view>

    <!-- 分割线 -->
    <view class="btn-group-layout-split__divider"></view>

    <!-- 下层 -->
    <view class="btn-group-layout-split__footer">
      <tap-action icon="setting" bind:tap="onSetting">
        <image src="/images/setting.png"></image>
      </tap-action>
      <tap-action icon="list" bind:tap="onList">
        <text>列表</text>
        <image src="/images/list.png"></image>
      </tap-action>
    </view>
  </view>
</view>
```

---

## 文件结构

```
components/
└── tap-action/           # 通用点击动效组件
    ├── index.js
    ├── index.json
    ├── index.wxml
    └── index.wxss

style/
└── button-group.wxss     # 按钮组样式

docs/
├── button-group-style-guide.md  # 按钮组规范
└── button-effect-reuse.md       # 本文档
```

---

**文档版本：** v2.0
**更新日期：** 2025-12-09
