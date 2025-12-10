# 骨架屏组件使用指南

骨架屏（Skeleton Screen）用于在内容加载时显示占位轮廓，提升用户感知体验。

**版本：** v1.0.0
**更新日期：** 2025-12-10

---

## 目录

1. [概述](#一概述)
2. [快速开始](#二快速开始)
3. [组件属性](#三组件属性)
4. [预设类型](#四预设类型)
5. [与加载系统配合](#五与加载系统配合)
6. [自定义样式](#六自定义样式)
7. [完整源码](#七完整源码)
8. [迁移到其他项目](#八迁移到其他项目)

---

## 一、概述

### 1.1 什么是骨架屏？

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   传统 Loading              骨架屏                              │
│   ┌──────────────┐        ┌──────────────────────────────┐    │
│   │              │        │ ████████████████████████████ │    │
│   │   ⏳ 加载中   │        │ ████████  ██████████████████ │    │
│   │              │        │ ████████████████████████████ │    │
│   └──────────────┘        │ ████████  ██████████████████ │    │
│                           └──────────────────────────────┘    │
│   用户无法预判内容          用户能提前感知内容布局              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 1.2 优势

| 特性 | 说明 |
|------|------|
| **减少感知延迟** | 用户看到结构，心理等待时间更短 |
| **避免布局抖动** | 预先占据空间，加载完成后平滑过渡 |
| **提升专业感** | 符合大厂应用的交互规范 |

### 1.3 文件结构

```
project/
├── components/
│   └── skeleton/
│       ├── index.js          # 组件逻辑
│       ├── index.json        # 组件配置
│       ├── index.wxml        # 组件模板
│       └── index.wxss        # 组件样式
└── style/
    └── skeleton.wxss         # 全局骨架屏样式（动画）
```

---

## 二、快速开始

### 2.1 全局注册组件

在 `app.json` 中注册：

```json
{
  "usingComponents": {
    "skeleton": "/components/skeleton/index"
  }
}
```

### 2.2 引入样式

在 `app.wxss` 中引入：

```css
@import "style/skeleton.wxss";
```

### 2.3 在页面中使用

```xml
<!-- 骨架屏 -->
<skeleton type="list" loading="{{loading}}" rows="5" avatar />

<!-- 正常内容（loading 为 false 时显示） -->
<view wx:if="{{!loading}}">
  <view wx:for="{{list}}" wx:key="id">{{item.name}}</view>
</view>
```

---

## 三、组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loading` | Boolean | `true` | 是否显示骨架屏 |
| `type` | String | `'list'` | 骨架屏类型：`list` / `card` / `detail` / `user` |
| `rows` | Number | `3` | 行数（list/card 类型有效） |
| `avatar` | Boolean | `false` | 是否显示头像（list 类型有效） |
| `avatarShape` | String | `'circle'` | 头像形状：`circle` / `square` |
| `title` | Boolean | `true` | 是否显示标题（list 类型有效） |
| `animate` | Boolean | `true` | 是否开启闪光动画 |

---

## 四、预设类型

### 4.1 列表类型（type="list"）

适用场景：通知列表、训练列表、消息列表

```xml
<!-- 基础列表 -->
<skeleton type="list" loading="{{loading}}" rows="5" />

<!-- 带头像的列表 -->
<skeleton type="list" loading="{{loading}}" rows="5" avatar />

<!-- 带方形头像的列表 -->
<skeleton type="list" loading="{{loading}}" rows="5" avatar avatarShape="square" />
```

效果预览：
```
┌──────────────────────────────────────┐
│ ●  ████████████████                  │
│    ██████████████████████████████    │
│    ████████████████████              │
├──────────────────────────────────────┤
│ ●  ████████████████                  │
│    ██████████████████████████████    │
│    ████████████████████              │
└──────────────────────────────────────┘
```

### 4.2 卡片类型（type="card"）

适用场景：专辑卡片、课程卡片

```xml
<skeleton type="card" loading="{{loading}}" rows="3" />
```

效果预览：
```
┌──────────────────────────────────────┐
│ ┌────────┐  ████████████████████     │
│ │        │  ██████████████           │
│ │  图片  │                           │
│ └────────┘                           │
├──────────────────────────────────────┤
│ ┌────────┐  ████████████████████     │
│ │  图片  │  ██████████████           │
│ └────────┘                           │
└──────────────────────────────────────┘
```

### 4.3 详情类型（type="detail"）

适用场景：文章详情、通知详情

```xml
<skeleton type="detail" loading="{{loading}}" />
```

效果预览：
```
┌──────────────────────────────────────┐
│ ████████████████████████████████     │  ← 标题
│                                      │
│ ██████  ██████                       │  ← 标签
│                                      │
│ ██████████████████████████████████   │
│ ██████████████████████████████████   │  ← 内容
│ ██████████████████████████████████   │
│ ████████████████████                 │
└──────────────────────────────────────┘
```

### 4.4 用户信息类型（type="user"）

适用场景：用户中心、个人主页

```xml
<skeleton type="user" loading="{{loading}}" />
```

效果预览：
```
┌──────────────────────────────────────┐
│                                      │
│    ●●●    ████████████               │  ← 头像 + 昵称
│           ██████████████████         │
│                                      │
├──────────────────────────────────────┤
│    ●      ●       ●                  │
│   ████   ████   ████                 │  ← 菜单项
└──────────────────────────────────────┘
```

---

## 五、与加载系统配合

骨架屏可以与现有的 `pageLoading` 配合使用：

```js
// pages/list/index.js
const pageGuard = require('../../behaviors/pageGuard')
const pageLoading = require('../../behaviors/pageLoading')
const loadError = require('../../behaviors/loadError')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],
  data: {
    list: []
  },

  onShow() {
    this.startLoading()  // 显示进度条
    this.listData()
  },

  listData() {
    this.hideLoadError()
    api.request(this, '/api/list', {}, true).then(res => {
      this.setData({ list: res })
      this.setDataReady()
      this.finishLoading()  // 隐藏进度条，同时 loading 变为 false
    }).catch(() => {
      pageGuard.showRetry(this)
    })
  },

  retryLoad() {
    this.startLoading()
    this.listData()
  }
})
```

```xml
<!-- pages/list/index.wxml -->
<import src="/templates/page-loading.wxml" />
<import src="/templates/load-error.wxml" />

<!-- 进度条 -->
<template is="pageLoading" data="{{loading, loadProgress}}" />

<!-- 错误重试 -->
<template is="loadError" data="{{loadError}}" />

<!-- 骨架屏（loading 为 true 时显示） -->
<skeleton type="list" loading="{{loading}}" rows="5" avatar wx:if="{{!loadError}}" />

<!-- 正常内容（loading 为 false 时显示） -->
<view class="list" wx:if="{{!loading && !loadError}}">
  <view wx:for="{{list}}" wx:key="id">{{item.name}}</view>
</view>
```

### 加载体验流程

```
用户进入页面
    │
    ▼
┌─────────────────────────────────────┐
│  1. 进度条 + 骨架屏 同时显示         │
│     ████████░░░░░░░░  (进度条)       │
│     ████████████████  (骨架)         │
│     ██████████████████████████████  │
└─────────────────────────────────────┘
    │
    │ 数据加载完成
    ▼
┌─────────────────────────────────────┐
│  2. 进度条完成 + 骨架屏消失          │
│     显示真实内容                     │
└─────────────────────────────────────┘
```

---

## 六、自定义样式

### 6.1 CSS 变量

骨架屏支持以下 CSS 变量：

```css
page {
  /* 骨架块背景色 */
  --skeleton-bg: #f0f0f0;

  /* 闪光高亮色 */
  --skeleton-highlight: #e8e8e8;
}
```

### 6.2 暗色主题示例

```css
/* 暗色主题 */
page.dark {
  --skeleton-bg: #2c2c2c;
  --skeleton-highlight: #3c3c3c;
}
```

### 6.3 关闭动画

如需关闭闪光动画（提升性能）：

```xml
<skeleton type="list" loading="{{loading}}" animate="{{false}}" />
```

---

## 七、完整源码

### 7.1 components/skeleton/index.js

```js
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
    loading: { type: Boolean, value: true },
    type: { type: String, value: 'list' },
    rows: { type: Number, value: 3 },
    avatar: { type: Boolean, value: false },
    avatarShape: { type: String, value: 'circle' },
    title: { type: Boolean, value: true },
    animate: { type: Boolean, value: true }
  },

  data: {
    rowsArray: []
  },

  observers: {
    'rows': function(rows) {
      this.setData({ rowsArray: new Array(rows).fill(0) })
    }
  },

  lifetimes: {
    attached() {
      this.setData({ rowsArray: new Array(this.data.rows).fill(0) })
    }
  }
})
```

### 7.2 components/skeleton/index.wxml

```xml
<view class="skeleton {{animate ? 'skeleton--animate' : ''}}" wx:if="{{loading}}">
  <!-- 列表类型 -->
  <block wx:if="{{type === 'list'}}">
    <view class="skeleton-item" wx:for="{{rowsArray}}" wx:key="index">
      <view class="skeleton-avatar {{avatarShape === 'square' ? 'skeleton-avatar--square' : ''}}" wx:if="{{avatar}}"></view>
      <view class="skeleton-content">
        <view class="skeleton-title" wx:if="{{title}}"></view>
        <view class="skeleton-row"></view>
        <view class="skeleton-row skeleton-row--short"></view>
      </view>
    </view>
  </block>

  <!-- 卡片类型 -->
  <block wx:elif="{{type === 'card'}}">
    <view class="skeleton-card" wx:for="{{rowsArray}}" wx:key="index">
      <view class="skeleton-card__image"></view>
      <view class="skeleton-card__content">
        <view class="skeleton-title"></view>
        <view class="skeleton-row"></view>
      </view>
    </view>
  </block>

  <!-- 详情类型 -->
  <block wx:elif="{{type === 'detail'}}">
    <view class="skeleton-detail">
      <view class="skeleton-detail__title"></view>
      <view class="skeleton-detail__meta">
        <view class="skeleton-tag"></view>
        <view class="skeleton-tag"></view>
      </view>
      <view class="skeleton-detail__content">
        <view class="skeleton-row"></view>
        <view class="skeleton-row"></view>
        <view class="skeleton-row"></view>
        <view class="skeleton-row skeleton-row--short"></view>
      </view>
    </view>
  </block>

  <!-- 用户信息类型 -->
  <block wx:elif="{{type === 'user'}}">
    <view class="skeleton-user">
      <view class="skeleton-user__avatar"></view>
      <view class="skeleton-user__info">
        <view class="skeleton-title"></view>
        <view class="skeleton-row skeleton-row--short"></view>
      </view>
    </view>
    <view class="skeleton-user__menu">
      <view class="skeleton-menu-item" wx:for="{{3}}" wx:key="index">
        <view class="skeleton-icon"></view>
        <view class="skeleton-row skeleton-row--tiny"></view>
      </view>
    </view>
  </block>
</view>
```

### 7.3 style/skeleton.wxss

详见项目中的 `style/skeleton.wxss` 文件，包含：
- 闪光动画 `skeleton-shimmer`
- 各类型骨架布局样式
- CSS 变量支持

---

## 八、迁移到其他项目

### 8.1 复制文件

```
components/
└── skeleton/
    ├── index.js
    ├── index.json
    ├── index.wxml
    └── index.wxss

style/
└── skeleton.wxss
```

### 8.2 注册组件

```json
// app.json
{
  "usingComponents": {
    "skeleton": "/components/skeleton/index"
  }
}
```

### 8.3 引入样式

```css
/* app.wxss */
@import "style/skeleton.wxss";
```

### 8.4 使用组件

```xml
<skeleton type="list" loading="{{loading}}" rows="5" />
```

---

## 九、最佳实践

### 9.1 骨架屏行数建议

| 页面类型 | 建议行数 | 说明 |
|----------|:--------:|------|
| 短列表 | 3-5 | 一屏可见的列表 |
| 长列表 | 5-8 | 超出一屏的列表 |
| 详情页 | - | 使用 detail 类型 |
| 用户中心 | - | 使用 user 类型 |

### 9.2 性能优化

- 列表数据较多时，考虑关闭动画：`animate="{{false}}"`
- 骨架屏行数不宜过多，一般 5-8 行足够

### 9.3 与错误状态配合

```xml
<!-- 加载失败时不显示骨架屏 -->
<skeleton loading="{{loading}}" wx:if="{{!loadError}}" />

<!-- 错误重试 -->
<template is="loadError" data="{{loadError}}" />

<!-- 正常内容 -->
<view wx:if="{{!loading && !loadError}}">...</view>
```

---

**文档版本：** v1.0.0
**最后更新：** 2025-12-10
**维护者：** 开发团队
