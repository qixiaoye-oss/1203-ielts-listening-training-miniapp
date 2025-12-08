# 全局错误处理机制指南

微信小程序 API 请求错误处理的统一方案，包含 reject 机制和分场景处理策略。

**版本：** v1.0.0
**更新日期：** 2025-12-08
**相关文件：**
- `utils/api.js` - 核心请求方法
- `style/load-error.wxss` - 加载失败样式

---

## 一、核心机制

### 1.1 api.js 中的 reject 处理

```js
function request(that, url, data, hasToast, method) {
  // ...
  return new Promise((resolve, reject) => {
    wx.request({
      // ...
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

### 1.2 错误类型

| 类型 | 触发条件 | reject 内容 |
|------|----------|-------------|
| 业务错误 | `res.data.code !== '200'` | `res.data`（包含 code、msg） |
| 网络错误 | 请求失败（超时、断网等） | 原始错误对象 |

---

## 二、处理策略分类

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

---

## 三、代码模板

### 3.1 策略A：退回上一级

适用于详情页、子页面加载失败。

```js
// JS
listData() {
  api.request(this, '/api/detail', {}, true).then(() => {
    this.finishLoading()
  }).catch(() => {
    this.finishLoading()
    setTimeout(() => wx.navigateBack(), 1500)
  })
}
```

### 3.2 策略B：显示重试按钮

适用于首页、列表页加载失败（无法退回或不应退回）。

```js
// JS
Page({
  data: {
    loadError: false
  },
  listData() {
    this.setData({ loadError: false })
    api.request(this, '/api/list', {}, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
      this.setData({ loadError: true })
    })
  },
  retryLoad() {
    this.startLoading()
    this.listData()
  }
})
```

```xml
<!-- WXML -->
<!-- 加载失败重试 -->
<view class="load-error" wx:if="{{loadError}}">
  <view class="load-error__text">加载失败</view>
  <view class="load-error__btn" bindtap="retryLoad">点击重试</view>
</view>
<view class="content" wx:if="{{!loadError}}">
  <!-- 正常内容 -->
</view>
```

```css
/* 引入公共样式（已在 app.wxss 中全局引入） */
@import '/style/load-error.wxss';
```

### 3.3 策略C：仅提示

适用于用户操作（保存、提交等）失败。

```js
// JS
saveData() {
  api.request(this, '/api/save', data, true, 'POST').then(() => {
    api.toast('保存成功')
  }).catch(() => {
    // 错误已在 api.js 中 toast，无需额外处理
  })
}
```

### 3.4 策略D：静默失败

适用于自动保存、埋点等后台操作。

```js
// JS
autoSave() {
  api.request(this, '/api/auto-save', data, true, 'POST').catch(() => {
    // 静默失败，不提示用户
  })
}
```

### 3.5 策略C + 恢复状态

适用于开关、选择器等需要恢复 UI 状态的场景。

```js
// JS
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

## 四、公共样式

### 4.1 load-error.wxss

```css
/* 加载失败重试样式 */
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
  font-size: 15px;
}

.load-error__btn:active {
  opacity: 0.8;
}
```

### 4.2 引入方式

在 `app.wxss` 中全局引入：

```css
@import "style/load-error.wxss";
```

---

## 五、场景选择指南

### 5.1 按请求类型选择

| 请求类型 | 推荐策略 | 说明 |
|----------|----------|------|
| 页面初始化（有上一级） | A 退回 | 用户可返回重新进入 |
| 页面初始化（无上一级） | B 重试 | 首页、入口页等 |
| 用户主动操作 | C 提示 | 保存、提交、删除等 |
| 后台自动操作 | D 静默 | 自动保存、埋点、记录等 |
| 辅助数据加载 | E 结束进度 | 非必需数据 |

### 5.2 按页面类型选择

| 页面类型 | 初始化加载 | 用户操作 |
|----------|------------|----------|
| 首页 | B 重试 | C 提示 |
| 列表页 | B 重试 | C 提示 |
| 详情页 | A 退回 | C 提示 |
| 设置页 | A 退回 | C 提示 + 恢复状态 |
| 编辑页 | A 退回 | C 提示 |
| 训练页 | A 退回 | D 静默（自动保存） |

---

## 六、注意事项

### 6.1 确保 .catch() 存在

每个 `api.request()` 调用都应该有 `.catch()` 处理，否则：
- 控制台会出现 "Uncaught (in promise)" 错误
- 进度条可能卡住不消失
- 页面状态可能异常

### 6.2 退回时机

使用策略A（退回）时，延迟 1.5 秒是为了让用户看到错误提示：

```js
.catch(() => {
  this.finishLoading()
  // 延迟1.5秒让用户看到 toast 提示
  setTimeout(() => wx.navigateBack(), 1500)
})
```

### 6.3 重试按钮的 loading 状态

重试时需要重新显示进度条：

```js
retryLoad() {
  this.startLoading()  // 重新显示进度条
  this.listData()
}
```

### 6.4 与 pageLoading behavior 配合

确保在 `.catch()` 中调用 `this.finishLoading()`，否则进度条会卡在 90%：

```js
.catch(() => {
  this.finishLoading()  // 必须调用
  // 其他处理...
})
```

---

## 七、迁移到其他项目

### 7.1 复制文件

1. `utils/api.js` - 核心请求方法（确保包含 reject 逻辑）
2. `style/load-error.wxss` - 加载失败样式
3. `behaviors/pageLoading.js` - 进度条 behavior（可选）
4. `templates/page-loading.wxml` - 进度条模板（可选）
5. `style/page-loading.wxss` - 进度条样式（可选）

### 7.2 在 app.wxss 中引入

```css
@import "style/load-error.wxss";
@import "style/page-loading.wxss";  /* 可选 */
```

### 7.3 逐页面添加错误处理

按照本文档的策略选择指南，为每个页面的请求添加合适的 `.catch()` 处理。

---

## 八、示例：完整页面

```js
// pages/example/index.js
const api = getApp().api
const pageLoading = require('../../behaviors/pageLoading')

Page({
  behaviors: [pageLoading],
  data: {
    loadError: false,
    list: []
  },

  onLoad() {
    this.startLoading()
    this.listData()
  },

  // 策略B：初始化加载，失败显示重试
  listData() {
    this.setData({ loadError: false })
    api.request(this, '/api/list', {}, true).then(() => {
      this.finishLoading()
    }).catch(() => {
      this.finishLoading()
      this.setData({ loadError: true })
    })
  },

  // 重试
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
<template is="pageLoading" data="{{loading, loadProgress}}" />

<!-- 加载失败重试 -->
<view class="load-error" wx:if="{{loadError}}">
  <view class="load-error__text">加载失败</view>
  <view class="load-error__btn" bindtap="retryLoad">点击重试</view>
</view>

<!-- 正常内容 -->
<view class="content" wx:if="{{!loadError}}">
  <view wx:for="{{list}}" wx:key="id">{{item.name}}</view>
</view>
```

---

**文档版本：** v1.0.0
**最后更新：** 2025-12-08
**维护者：** 开发团队
