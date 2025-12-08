# 加载动效使用指南

微信小程序加载动效 **Behavior + 模板** 方案，提供统一的页面加载视觉反馈。

> **注意**：这是一个基于 Behavior 的可复用方案，包含 JS 逻辑、WXML 模板和 WXSS 样式三部分。

**版本：** v1.1.0
**更新日期：** 2025-12-08

**相关文件：**

| 类型 | Behavior | WXML 模板 | 样式文件 |
|------|----------|-----------|----------|
| 页面进度条 | `behaviors/loadingProgress.js` | `templates/loading-progress.wxml` | `style/loading-progress.wxss` |
| 音频加载 | `behaviors/audioLoading.js` | `templates/audio-loading.wxml` | `style/audio-loading.wxss` |

---

## 快速引入

### 1. 在页面 JS 中引入 Behavior

```js
const loadingProgress = require('../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],
  // ...
})
```

### 2. 在页面 WXML 中引入模板

```xml
<import src="/templates/loading-progress.wxml" />
<template is="loadingProgress" data="{{loading, loadProgress}}" />

<!-- 页面其他内容 -->
```

### 3. 在页面 WXSS 中引入样式

```css
@import '/style/loading-progress.wxss';
```

---

## API 方法

| 方法 | 说明 |
|------|------|
| `this.startLoading()` | 开始加载，显示进度条并启动动画 |
| `this.finishLoading()` | 完成加载，进度条快速到 100% 后隐藏 |

### Data 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `loading` | Boolean | 是否显示进度条 |
| `loadProgress` | Number | 当前进度值 (0-100) |

---

## 使用示例

### 基础用法

```js
const api = getApp().api
const loadingProgress = require('../../behaviors/loadingProgress')

Page({
  behaviors: [loadingProgress],

  onLoad() {
    this.startLoading()
    this.fetchData()
  },

  fetchData() {
    api.request(this, '/api/data', {}, true)
      .then(() => {
        this.finishLoading()
      })
      .catch(() => {
        this.finishLoading()
      })
  }
})
```

### 配合内容显示控制

```js
Page({
  behaviors: [loadingProgress],
  data: {
    isReady: false
  },

  onLoad() {
    this.startLoading()
    this.fetchData()
  },

  fetchData() {
    api.request(this, '/api/data', {}, true)
      .then(() => {
        this.setData({ isReady: true })
        this.finishLoading()
      })
      .catch(() => {
        this.finishLoading()
      })
  }
})
```

```xml
<import src="/templates/loading-progress.wxml" />
<template is="loadingProgress" data="{{loading, loadProgress}}" />

<view wx:if="{{isReady}}">
  <!-- 页面内容 -->
</view>
```

---

## 进度条动画机制

```
┌─────────────────────────────────────────────────────────────────┐
│                     进度条动画流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  startLoading() 调用后：                                         │
│     1. 显示进度条 (loading = true)                               │
│     2. 启动模拟进度动画                                           │
│        └─ 每 100ms 增长，速度逐渐变慢                             │
│        └─ 最多增长到 90%（等待实际完成）                          │
│                                                                 │
│  finishLoading() 调用后：                                        │
│     1. 停止模拟动画                                              │
│     2. 快速跳到 100%                                             │
│     3. 延迟 300ms 后隐藏进度条                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 样式说明

进度条固定在页面顶部，高度 3px，带有渐变色和光泽动画效果。

```css
.loading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
}

.loading-progress-bar__inner {
  background: linear-gradient(90deg, var(--theme-color, #007bff), #00c6ff);
  /* 带有闪光动画效果 */
}
```

---

## 与全局 Loading 的关系

项目中存在两层加载提示机制：

### 1. 页面级进度条（本方案）

- 显示在页面顶部的细进度条
- 需要页面主动引入和调用
- 提供更好的视觉体验

### 2. 全局 API 延迟 Loading（兜底方案）

位于 `utils/api.js` 中：

```js
// 请求超过 1 秒才显示 loading
if (!hasToast) {
  timer = setTimeout(function () {
    wx.showLoading({ title: '努力加载中...' })
  }, 1000)
}
```

**设计原则**：
- 快速请求（<1秒）：不显示任何全局提示
- 慢速请求（>1秒）：自动显示原生 loading 作为兜底
- 页面使用进度条时：传入 `hasToast=true` 跳过全局 loading

---

## 音频加载进度（圆饼进度）

用于音频下载时显示全屏圆饼进度动画。

### 快速引入

#### 1. 在页面 JS 中引入 Behavior

```js
const audioLoading = require('../../behaviors/audioLoading')

Page({
  behaviors: [audioLoading],
  // ...
})
```

#### 2. 在页面 WXML 中引入模板

```xml
<import src="/templates/audio-loading.wxml" />
<template is="audioLoading" data="{{audioDownProgress}}" />
```

### API 方法

| 方法 | 说明 |
|------|------|
| `this.startAudioLoading()` | 开始加载，重置进度为 0 |
| `this.updateAudioProgress(progress)` | 更新进度值 (0-100) |
| `this.finishAudioLoading()` | 完成加载，进度设为 100 |

### Data 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `audioDownProgress` | Number | 100 | 音频下载进度 (0-100)，100 时隐藏遮罩 |

### 使用示例

```js
const audioLoading = require('../../behaviors/audioLoading')
const audioApi = require('../../utils/audioApi')

Page({
  behaviors: [audioLoading],

  loadAudio(url) {
    this.startAudioLoading()
    audioApi.initAudio(url, (progress) => {
      this.updateAudioProgress(progress)
    }).then(() => {
      this.finishAudioLoading()
    }).catch(() => {
      this.finishAudioLoading()
    })
  }
})
```

### 样式说明

全屏白色遮罩 + 圆饼进度动画，使用 CSS `conic-gradient` 实现。

```css
.audio-loading-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #fff;
  z-index: 9999;
}

.audio-loading-pie {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /* 使用 conic-gradient 实现圆饼进度 */
}
```

---

## 已使用的页面

### 页面进度条

| 页面 | 路径 |
|------|------|
| 精听训练 | `pages/training/listening/intensive/index` |
| 泛听训练 | `pages/training/listening/extensive/index` |
| 听力讲解 | `pages/training/listening/explanation/index` |
| 精听笔记 | `pages/training/listening/intensive-notes/index` |
| 通知详情 | `pages/notice/detail/index` |
| 首页 | `pages/home/index` |

### 音频加载进度

| 页面 | 路径 |
|------|------|
| 精听训练 | `pages/training/listening/intensive/index` |
| 泛听训练 | `pages/training/listening/extensive/index` |
| 听力讲解 | `pages/training/listening/explanation/index` |

---

## Toast 提示规范

### 应该使用 Toast 的场景

| 场景 | 示例 | 必要性 |
|------|------|--------|
| 操作成功反馈 | "保存成功" | 必要 |
| 表单验证提示 | "请填写用户昵称" | 必要 |
| 边界提示 | "已经最后一句啦！" | 必要 |
| 错误提示 | "更新失败" | 必要 |

### 不应该使用 Toast 的场景

| 场景 | 替代方案 |
|------|----------|
| 页面数据加载中 | 使用进度条 |
| 长时间等待提示 | 使用进度条 + 内容区骨架屏 |

---

**文档版本：** v1.1.0
**最后更新：** 2025-12-08
**维护者：** 开发团队
