# 加载状态管理指南

微信小程序加载状态管理的统一方案，包含加载动效、错误处理策略和复用指南。

> **注意**：这是一个基于 Behavior 的可复用方案，包含 JS 逻辑、WXML 模板和 WXSS 样式三部分。

**版本：** v3.1.0
**更新日期：** 2025-12-10

### 更新日志（v3.1.0）

- **pageLoading**：添加定时器自动清理，防止内存泄漏
- **audioLoading**：新增 `audioLoading` 布尔变量，语义更清晰
- **api.js**：添加请求超时机制（默认30秒）
- **errorHandler**：新增 `cancelGoBack()` 和 `resetAndReload()` 方法
- **loadError**：支持自定义错误提示文案

---

## 一、概述

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                     加载状态管理体系                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  第1层：加载动效                                                 │
│    ├─ pageLoading（页面进度条）                                  │
│    └─ audioLoading（音频圆饼进度）                                │
│                                                                 │
│  第2层：全局API兜底                                              │
│    └─ api.js 延迟1秒显示原生 loading                            │
│                                                                 │
│  第3层：错误处理策略（utils/errorHandler.js）                    │
│    ├─ 策略A：errorHandler.goBack() - 退回上一级                 │
│    ├─ 策略B：errorHandler.showRetry() - 显示重试按钮            │
│    ├─ 策略C：仅提示（api.js 自动 toast）                        │
│    ├─ 策略D：静默失败（空 catch）                               │
│    └─ 策略E：errorHandler.finishProgress() - 仅结束进度         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 相关文件

| 类型 | Behavior | WXML 模板 | 样式文件 | 工具函数 |
|------|----------|-----------|----------|----------|
| 页面进度条 | `behaviors/pageLoading.js` | `templates/page-loading.wxml` | `style/page-loading.wxss` | - |
| 音频加载 | `behaviors/audioLoading.js` | `templates/audio-loading.wxml` | `style/audio-loading.wxss` | - |
| 加载失败 | `behaviors/loadError.js` | `templates/load-error.wxml` | `style/load-error.wxss` | - |
| 错误处理 | - | - | - | `utils/errorHandler.js` |

---

## 二、页面进度条（pageLoading）

用于页面数据加载时显示顶部进度条动画。

### 2.1 快速引入

**JS 文件：**
```js
const pageLoading = require('../../behaviors/pageLoading')

Page({
  behaviors: [pageLoading],
  // ...
})
```

**WXML 文件：**
```xml
<import src="/templates/page-loading.wxml" />
<template is="pageLoading" data="{{loading, loadProgress}}" />
```

### 2.2 API 方法

| 方法 | 说明 |
|------|------|
| `this.startLoading()` | 开始加载，显示进度条并启动动画 |
| `this.finishLoading()` | 完成加载，进度条快速到 100% 后隐藏 |

### 2.3 Data 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `loading` | Boolean | 是否显示进度条 |
| `loadProgress` | Number | 当前进度值 (0-100) |

### 2.4 动画机制

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
│  页面隐藏/销毁时：                                                │
│     └─ 自动清理定时器，防止内存泄漏                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.5 样式说明

进度条固定在页面顶部，高度 3px，带有渐变色和光泽动画效果。

```css
.page-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
}

.page-loading-bar__inner {
  background: linear-gradient(90deg, var(--theme-color, #007bff), #00c6ff);
  /* 带有闪光动画效果 */
}
```

---

## 三、音频加载进度（audioLoading）

用于音频下载时显示全屏圆饼进度动画。

### 3.1 快速引入

**JS 文件：**
```js
const audioLoading = require('../../behaviors/audioLoading')

Page({
  behaviors: [audioLoading],
  // ...
})
```

**WXML 文件：**
```xml
<import src="/templates/audio-loading.wxml" />
<template is="audioLoading" data="{{audioLoading, audioDownProgress}}" />
```

### 3.2 API 方法

| 方法 | 说明 |
|------|------|
| `this.startAudioLoading()` | 开始加载，显示遮罩并重置进度为 0 |
| `this.updateAudioProgress(progress)` | 更新进度值 (0-100) |
| `this.finishAudioLoading()` | 完成加载，隐藏遮罩 |

### 3.3 Data 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `audioLoading` | Boolean | false | 是否显示加载遮罩（v3.1.0 新增） |
| `audioDownProgress` | Number | 0 | 音频下载进度 (0-100) |

### 3.4 使用示例

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

### 3.5 样式说明

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

## 四、全局 API 兜底机制

位于 `utils/api.js` 中，作为加载提示的兜底方案。

### 4.1 核心逻辑

```js
// 请求超过 1 秒才显示 loading
if (!hasToast) {
  timer = setTimeout(function () {
    wx.showLoading({ title: '努力加载中...' })
  }, 1000)
}
```

### 4.2 设计原则

- **快速请求（<1秒）**：不显示任何全局提示
- **慢速请求（>1秒）**：自动显示原生 loading 作为兜底
- **页面使用进度条时**：传入 `hasToast=true` 跳过全局 loading

### 4.3 请求超时机制（v3.1.0 新增）

```js
/**
 * @param {number} timeout - 超时时间（毫秒），默认30秒
 */
api.request(this, '/api/data', {}, true, 'GET', 30000)
```

- **默认超时**：30秒
- **超时提示**：自动显示 "请求超时，请检查网络后重试"
- **超时错误**：reject `{ code: 'TIMEOUT', message: '请求超时' }`

---

## 五、错误处理策略

### 5.1 API reject 机制

```js
function request(that, url, data, hasToast, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == '200') {
          resolve(res.data.data)
        } else {
          // 业务错误：显示错误信息并 reject
          toast(res.data.msg || res.data.message)
          reject(res.data)
        }
      },
      fail: function (res) {
        // 网络错误：显示通用错误并 reject
        wx.hideLoading()
        toast('请求失败，请稍候再试')
        reject(res)
      }
    })
  })
}
```

### 5.2 五种处理策略

```
┌─────────────────────────────────────────────────────────────────┐
│                        错误处理策略                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  策略A【退回】：显示错误 → 1.5秒后退回上一级                       │
│     适用：详情页、子页面初始化加载失败                            │
│     代码：setTimeout(() => wx.navigateBack(), 1500)             │
│                                                                 │
│  策略B【重试】：显示错误 → 展示重试按钮                           │
│     适用：首页、列表页初始化加载失败                              │
│     代码：this.setData({ loadError: true })                     │
│                                                                 │
│  策略C【提示】：仅显示错误提示（已在 api.js 中 toast）            │
│     适用：用户操作失败（保存、提交、删除等）                       │
│     代码：.catch(() => { /* 错误已提示 */ })                    │
│                                                                 │
│  策略D【静默】：不显示错误，静默失败                              │
│     适用：自动保存、埋点上报、播放记录等后台操作                   │
│     代码：.catch(() => { /* 静默失败 */ })                      │
│                                                                 │
│  策略E【结束进度】：仅结束进度条，不额外处理                       │
│     适用：非关键的辅助数据加载                                   │
│     代码：.catch(() => { this.finishLoading() })                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 策略选择指南

**按请求类型选择：**

| 请求类型 | 推荐策略 | 说明 |
|----------|----------|------|
| 页面初始化（有上一级） | A 退回 | 用户可返回重新进入 |
| 页面初始化（无上一级） | B 重试 | 首页、入口页等 |
| 用户主动操作 | C 提示 | 保存、提交、删除等 |
| 后台自动操作 | D 静默 | 自动保存、埋点、记录等 |
| 辅助数据加载 | E 结束进度 | 非必需数据 |

**按页面类型选择：**

| 页面类型 | 初始化加载 | 用户操作 |
|----------|------------|----------|
| 首页 | B 重试 | C 提示 |
| 列表页 | B 重试 | C 提示 |
| 详情页 | A 退回 | C 提示 |
| 设置页 | A 退回 | C 提示 + 恢复状态 |
| 编辑页 | A 退回 | C 提示 |
| 训练页 | A 退回 | D 静默（自动保存） |

---

## 六、加载失败模板（loadError）

### 6.1 快速引入

**JS 文件：**
```js
const pageLoading = require('../../behaviors/pageLoading')
const loadError = require('../../behaviors/loadError')

Page({
  behaviors: [pageLoading, loadError],
  // ...
})
```

**WXML 文件：**
```xml
<import src="/templates/load-error.wxml" />
<template is="loadError" data="{{loadError, loadErrorText}}" />
```

### 6.2 API 方法

| 方法 | 说明 |
|------|------|
| `this.showLoadError(text)` | 显示加载失败状态，可传入自定义提示文案（v3.1.0 新增） |
| `this.hideLoadError()` | 隐藏加载失败状态 |

### 6.2.1 自定义错误提示（v3.1.0 新增）

```js
// 使用默认提示 "加载失败"
this.showLoadError()

// 使用自定义提示
this.showLoadError('网络连接失败')
this.showLoadError('数据获取超时')
```

### 6.3 配套 JS 代码

```js
const api = getApp().api
const errorHandler = getApp().errorHandler
const pageLoading = require('../../behaviors/pageLoading')
const loadError = require('../../behaviors/loadError')

Page({
  behaviors: [pageLoading, loadError],

  listData() {
    this.hideLoadError()
    api.request(this, '/api/list', {}, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      errorHandler.showRetry(this)
    })
  },

  retryLoad() {
    this.startLoading()
    this.listData()
  }
})
```

### 6.4 样式说明

```css
.load-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
}

.load-error__text {
  font-size: 16px;
  color: #999;
}

.load-error__btn {
  padding: 10px 30px;
  background: var(--theme-color, #007bff);
  color: #fff;
  border-radius: 6px;
}
```

---

## 七、错误处理工具（errorHandler）

### 7.1 快速引入

```js
const errorHandler = getApp().errorHandler
```

### 7.2 API 方法

| 方法 | 说明 | 适用场景 |
|------|------|----------|
| `errorHandler.goBack(page)` | 结束加载 → 1.5秒后退回 | 详情页、子页面加载失败 |
| `errorHandler.cancelGoBack()` | 取消自动返回（v3.1.0 新增） | 用户手动返回时调用 |
| `errorHandler.showRetry(page)` | 结束加载 → 显示重试按钮 | 首页、列表页加载失败 |
| `errorHandler.finishProgress(page)` | 仅结束加载状态 | 非关键数据加载失败 |
| `errorHandler.resetAndReload(page, method)` | 重置状态并重新加载（v3.1.0 新增） | 重试加载时使用 |

### 7.3 特性

- **自动处理多种加载状态**：自动检测并结束 `pageLoading` 和 `audioLoading`
- **减少重复代码**：无需手动调用 `finishLoading()` + `finishAudioLoading()`
- **统一入口**：所有错误处理走同一套逻辑
- **防重复返回**（v3.1.0）：`goBack()` 检查页面栈，避免多次返回
- **统一重置**（v3.1.0）：`resetAndReload()` 一键重置所有状态

### 7.4 resetAndReload 使用示例（v3.1.0 新增）

```js
// 简化 retryLoad 实现
retryLoad() {
  errorHandler.resetAndReload(this, 'listData')
}

// 等同于：
retryLoad() {
  this.hideLoadError()
  this.startLoading()
  this.listData()
}
```

---

## 八、代码模板

### 8.1 策略A：退回上一级

```js
const errorHandler = getApp().errorHandler

listData() {
  api.request(this, '/api/detail', {}, true).then(() => {
    this.finishLoading()
  }).catch(() => {
    errorHandler.goBack(this)
  })
}
```

### 8.2 策略B：显示重试按钮

```js
const errorHandler = getApp().errorHandler
const pageLoading = require('../../behaviors/pageLoading')
const loadError = require('../../behaviors/loadError')

Page({
  behaviors: [pageLoading, loadError],

  listData() {
    this.hideLoadError()
    api.request(this, '/api/list', {}, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      errorHandler.showRetry(this)
    })
  },

  retryLoad() {
    this.startLoading()
    this.listData()
  }
})
```

### 8.3 策略C：仅提示

```js
saveData() {
  api.request(this, '/api/save', data, true, 'POST').then(() => {
    api.toast('保存成功')
  }).catch(() => {
    // 错误已在 api.js 中 toast
  })
}
```

### 8.4 策略D：静默失败

```js
autoSave() {
  api.request(this, '/api/auto-save', data, true, 'POST').catch(() => {
    // 静默失败
  })
}
```

### 8.5 策略E：仅结束进度

```js
const errorHandler = getApp().errorHandler

loadOptionalData() {
  api.request(this, '/api/optional', {}, true).then(() => {
    this.finishLoading()
  }).catch(() => {
    errorHandler.finishProgress(this)
  })
}
```

### 8.6 策略C + 恢复状态

```js
onToggleChange(e) {
  const newValue = e.detail.value
  const oldValue = this.data.item.value
  // 先乐观更新 UI
  this.setData({ 'item.value': newValue })

  api.request(this, '/api/update', { value: newValue }, true, 'POST').catch(() => {
    // 失败时恢复状态
    this.setData({ 'item.value': oldValue })
  })
}
```

---

## 九、注意事项

### 9.1 确保 .catch() 存在

每个 `api.request()` 调用都应该有 `.catch()` 处理，否则：
- 控制台会出现 "Uncaught (in promise)" 错误
- 进度条可能卡住不消失
- 页面状态可能异常

### 9.2 与 pageLoading 配合

确保在 `.catch()` 中调用 `this.finishLoading()`，否则进度条会卡在 90%：

```js
.catch(() => {
  this.finishLoading()  // 必须调用
  // 其他处理...
})
```

### 9.3 退回时机

使用策略A（退回）时，延迟 1.5 秒是为了让用户看到错误提示。

---

## 十、已使用的页面

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

### 加载失败重试

| 页面 | 路径 |
|------|------|
| 首页 | `pages/home/index` |
| 通知列表 | `pages/notice/list/index` |
| 训练列表 | `pages/training/list/album/index` |
| 用户中心 | `pages/user/user/user` |

---

## 十一、迁移到其他项目

### 11.1 复制文件

```
behaviors/
├── pageLoading.js
├── audioLoading.js
└── loadError.js

templates/
├── page-loading.wxml
├── audio-loading.wxml
└── load-error.wxml

style/
├── page-loading.wxss
├── audio-loading.wxss
└── load-error.wxss

utils/
├── api.js（确保包含 reject 逻辑）
└── errorHandler.js
```

### 11.2 在 app.js 中引入

```js
const errorHandler = require('utils/errorHandler.js')

App({
  errorHandler: errorHandler,
  // ...
})
```

### 11.3 在 app.wxss 中引入

```css
@import "style/page-loading.wxss";
@import "style/audio-loading.wxss";
@import "style/load-error.wxss";
```

### 11.4 逐页面接入

1. 引入 pageLoading behavior
2. 在 WXML 中添加模板
3. 按策略选择指南添加错误处理

---

## 十二、完整示例

```js
// pages/example/index.js
const api = getApp().api
const errorHandler = getApp().errorHandler
const pageLoading = require('../../behaviors/pageLoading')
const loadError = require('../../behaviors/loadError')

Page({
  behaviors: [pageLoading, loadError],
  data: {
    list: []
  },

  onLoad() {
    this.startLoading()
    this.listData()
  },

  // 策略B：初始化加载，失败显示重试
  listData() {
    this.hideLoadError()
    api.request(this, '/api/list', {}, true).then((data) => {
      this.setData({ list: data })
      this.finishLoading()
    }).catch(() => {
      errorHandler.showRetry(this)
    })
  },

  retryLoad() {
    this.startLoading()
    this.listData()
  },

  // 策略C：用户操作，失败仅提示
  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    api.request(this, `/api/delete/${id}`, {}, true, 'DELETE').then(() => {
      api.toast('删除成功')
      this.listData()
    }).catch(() => {
      // 错误已提示
    })
  },

  // 策略D：后台操作，静默失败
  trackView() {
    api.request(this, '/api/track', { page: 'example' }, true, 'POST').catch(() => {
      // 静默失败
    })
  }
})
```

```xml
<!-- pages/example/index.wxml -->
<import src="/templates/page-loading.wxml" />
<import src="/templates/load-error.wxml" />
<template is="pageLoading" data="{{loading, loadProgress}}" />
<template is="loadError" data="{{loadError}}" />

<!-- 正常内容 -->
<view class="content" wx:if="{{!loadError}}">
  <view wx:for="{{list}}" wx:key="id">{{item.name}}</view>
</view>
```

---

## 十三、Toast 提示规范

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

**文档版本：** v3.1.0
**最后更新：** 2025-12-10
**维护者：** 开发团队
