# 按钮组样式库 (Button Group Styles)

微信小程序通用按钮组 **CSS 样式工具类库**，提供固定底部容器、多种布局模式和蒙版功能。

> **注意**：这是一个纯 CSS 样式库，不是微信小程序自定义组件。
> 通过 `@import` 引入样式后，直接在 wxml 中使用 CSS 类名即可。

## 版本

**当前版本：** v1.6.0
**发布日期：** 2025-12-06

---

## 按钮组构建流程

按钮组的构建遵循严格的标准化流程：

```
Step 1: 选择层数 ──→ Step 2: 定义按钮 ──→ Step 3: 自动蒙版
     │                    │                    │
     ├─ 一层              ├─ 指定 icon         └─ 使用 .btn-page-bottom
     └─ 两层              ├─ 自动应用主色           自动获得蒙版A+B
                          └─ 指定位置
```

---

## Step 1: 选择层数

### 一层结构

使用 `.btn-group-layout-inline-center`

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-inline-center">
    <!-- 按钮 -->
  </view>
</view>
```

### 两层结构

使用 `.btn-group-layout-split`

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <!-- 上层 -->
    <view class="btn-group-layout-split__header">
      <!-- 按钮 -->
    </view>
    <!-- 分割线 -->
    <view class="btn-group-layout-split__divider"></view>
    <!-- 下层 -->
    <view class="btn-group-layout-split__footer">
      <!-- 按钮 -->
    </view>
  </view>
</view>
```

---

## Step 2: 定义按钮

### 2.1 按钮类型

| 类名 | 用途 | 包含内容 |
|------|------|---------|
| `.btn-action` | 带文字和图标的按钮 | 文字 + icon |
| `.btn-action-icon` | 纯图标按钮 | 仅 icon |

### 2.2 按钮标准数值（固定不变）

| 属性 | 数值 | 说明 |
|------|------|------|
| icon 尺寸 | 25px | 所有按钮图标统一 |
| 文字大小 | 15px | 按钮文本字体 |
| 按钮内边距 | 5px | 文字/图标与按钮边缘 |
| 文字与图标间距 | 5px | 同一按钮内 |
| 按钮高度 | 35px | 5px + 25px + 5px |

### 2.3 指定 icon（自动应用主色）

icon 一旦确定，按钮的**文字颜色**和**背景色**均跟随该 icon 的主色。

```xml
<!-- 使用 data-icon 属性指定 icon，自动应用对应主色 -->
<view class="btn-action" data-icon="play">
  <view>播放</view>
  <image src="/images/play.png"></image>
</view>
```

> **注意**：icon 颜色映射表待配置后启用。在此之前，请手动使用颜色类（如 `.btn--audio`）。

#### 当前可用颜色类

| 类名 | 主色 | 用途 |
|------|------|------|
| `.btn--audio` | #00A6ED 蓝色 | 音频播放 |
| `.btn--correct` | #00D26A 绿色 | 正确确认 |
| `.btn--wrong` | #F92F60 红色 | 错误删除 |
| `.btn--list` | #FFB02D 黄色 | 列表导航 |
| `.btn--setting` | #998EA4 紫灰 | 设置配置 |
| `.btn--visible` | #7D4533 棕色 | 显示隐藏 |
| `.btn--label` | #F8312F 红色 | 标记标签 |
| `.btn--recording` | #212121 黑色 | 录音相关 |
| `.btn--practice` | #433B6B 深紫 | 练习模式 |
| `.btn--exercise` | #533566 紫色 | 习题练习 |
| `.btn--dis` | - | 禁用状态(透明度0.3) |

### 2.4 指定位置

按钮位置分为以下几种：

| 位置 | 类名/方式 | 说明 |
|------|----------|------|
| 居中（单按钮） | 默认 | 无需额外类，常规居中 |
| 居中（双按钮） | `.btn-pos-dual-center` | 两按钮间距15px，间距中点居中 |
| 左1 | `.btn-pos-left-1` | 第一个靠左按钮 |
| 左2 | `.btn-pos-left-2` | 第二个靠左按钮（紧跟左1） |
| 右1 | `.btn-pos-right-1` | 第一个靠右按钮 |
| 右2 | `.btn-pos-right-2` | 第二个靠右按钮（紧跟右1） |

#### 位置规则

- 靠左/靠右时，按钮距离边缘灰框的 padding 为 **15px**
- 按钮与按钮之间的间距为 **15px**

#### 位置示例

**单按钮居中：**
```xml
<view class="btn-group-layout-inline-center">
  <view class="btn-action btn--correct">提交</view>
</view>
```

**双按钮居中：**
```xml
<view class="btn-group-layout-inline-center btn-pos-dual-center">
  <view class="btn-action btn--audio">播放</view>
  <view class="btn-action btn--correct">提交</view>
</view>
```

**左右分布：**
```xml
<view class="btn-group-layout-split__footer">
  <view class="btn-action btn--setting btn-pos-left-1">设置</view>
  <view class="btn-action btn--list btn-pos-right-1">列表</view>
</view>
```

**左侧多按钮 + 右侧单按钮：**
```xml
<view class="btn-group-layout-split__header">
  <view class="btn-pos-left-group">
    <view class="btn-action btn--audio">播放</view>
    <view class="btn-action btn--audio">重播</view>
  </view>
  <view class="btn-action btn--correct btn-pos-right-1">听懂</view>
</view>
```

---

## Step 3: 自动蒙版

使用 `.btn-page-bottom` 容器，自动获得蒙版A和蒙版B。

### 蒙版结构

```
┌─────────────────────────────────────┐
│ 页面列表内容（或其他内容）             │
├─────────────────────────────────────┤ ← 15px padding
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 蒙版B（15px渐变至透明）
├─────────────────────────────────────┤ ← 灰框上边缘
│                                     │ ← 15px padding
│  ┌─────────────────────────────┐   │
│  │  按钮（icon+文字）            │   │ ← 按钮高度 35px
│  └─────────────────────────────┘   │
│                                     │ ← 15px padding
├─────────────────────────────────────┤ ← 灰框下边缘
│█████████████████████████████████████│
│█████████████ 蒙版A ██████████████████│ ← 白色背景至视窗底
│█████████████████████████████████████│
└─────────────────────────────────────┘ ← 20px padding
  视窗底边缘
```

### 蒙版说明

| 蒙版 | 作用 | 实现 |
|------|------|------|
| 蒙版A | 从灰框上边缘往下，覆盖至视窗底边缘 | `::before` 白色背景 |
| 蒙版B | 从灰框上边缘往上15px，渐变至100%透明 | `::after` 渐变背景 |

---

## 高度计算

### 按钮组高度

```
单层高度 = 15px(上padding) + 35px(按钮) + 15px(下padding) + 2px(边框)
        = 67px

双层高度 = 15px + 35px + 15px + 1px(分割线) + 15px + 35px + 15px + 2px
        = 133px（实际约110px，因padding合并）
```

### 页面内容 padding-bottom

```
padding-bottom = 按钮组高度 + 15px(内容与按钮组间距)

单层：67px + 15px = 82px
双层：110px + 15px = 125px
```

---

## 快速引入

```css
/* app.wxss */
@import "style/button-group/button-group.wxss";
```

---

## 完整示例

### 示例1：单层单按钮

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-inline-center">
    <view class="btn-action btn--correct" bindtap="submit">
      <view>提交</view>
      <image src="/images/submit.png"></image>
    </view>
  </view>
</view>
```

### 示例2：双层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <!-- 上层 -->
    <view class="btn-group-layout-split__header">
      <view class="btn-pos-left-group">
        <view class="btn-action btn--audio" bindtap="replay">
          <view>重播</view>
          <image src="/images/replay.png"></image>
        </view>
        <view class="btn-action btn--audio" bindtap="play">
          <view>播放</view>
          <image src="/images/play.png"></image>
        </view>
      </view>
      <view class="btn-action btn--correct btn-pos-right-1" bindtap="confirm">
        <view>听懂</view>
        <image src="/images/correct.png"></image>
      </view>
    </view>

    <!-- 分割线 -->
    <view class="btn-group-layout-split__divider"></view>

    <!-- 下层 -->
    <view class="btn-group-layout-split__footer">
      <view class="btn-action-icon btn--setting btn-pos-left-1" bindtap="setting">
        <image src="/images/setting.png"></image>
      </view>
      <view class="btn-action btn--list btn-pos-right-1" bindtap="list">
        <view>列表</view>
        <image src="/images/list.png"></image>
      </view>
    </view>
  </view>
</view>
```

---

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本更新记录。

---

## 相关文档

- [按钮组样式规范文档](../../docs/button-group-style-guide.md)
