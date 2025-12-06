# 按钮组样式规范文档

微信小程序通用按钮组 **CSS 样式工具类库**，提供固定底部容器、多种布局模式和蒙版功能。

> **注意**：这是一个纯 CSS 样式库，不是微信小程序自定义组件。
> 通过 `@import` 引入样式后，直接在 wxml 中使用 CSS 类名即可。

**版本：** v1.6.0
**更新日期：** 2025-12-06
**样式文件：** `style/button-group.wxss`

---

## 快速引入

```css
/* app.wxss */
@import "style/button-group.wxss";
```

---

## 一、按钮组构建流程

按钮组是一个**标准化组件**，构建时必须遵循严格的流程：

```
┌─────────────────────────────────────────────────────────────────┐
│                     按钮组构建流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: 选择层数                                                │
│     ├─ 一层：.btn-group-layout-inline-center                     │
│     └─ 两层：.btn-group-layout-split                             │
│           ├─ header（上层）                                      │
│           ├─ divider（分割线）                                   │
│           └─ footer（下层）                                      │
│                                                                 │
│  Step 2: 定义按钮                                                │
│     ├─ 指定 icon → 自动应用对应主色（文字颜色 + 背景色）            │
│     └─ 指定位置 → 居中/左1/左2/右1/右2                            │
│                                                                 │
│  Step 3: 自动蒙版                                                │
│     └─ 使用 .btn-page-bottom 容器                                │
│           ├─ 蒙版A：灰框上边缘 → 视窗底边缘（白色背景）             │
│           └─ 蒙版B：灰框上边缘往上15px（渐变至透明）               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、标准数值（固定不变）

以下数值在任何情况下均**统一不变**：

### 2.1 按钮内部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| icon 尺寸 | **25px** | 所有按钮图标统一尺寸 |
| 文字大小 | **15px** | 按钮文本字体大小 |
| 按钮内边距 | **5px** | 文字/图标与按钮边缘的距离 |
| 文字与图标间距 | **5px** | 同一按钮内文字和图标的间距 |
| 按钮高度 | **35px** | 5px(上) + 25px(icon) + 5px(下) |

### 2.2 按钮组容器数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 容器内边距 | **15px** | 按钮组容器与灰框边缘的距离 |
| 按钮间距 | **15px** | 相邻按钮之间的间距（gap） |
| 边框 | **1px solid** | 按钮组外边框 |
| 边框颜色 | **rgba(0,0,0,0.3)** | 灰色边框 |
| 容器圆角 | **9px** | 按钮组容器圆角半径 |

### 2.3 固定底部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 距视窗底部 | **20px** | 按钮组距视窗底边缘 |
| 距视窗左右 | **20px** | 按钮组距视窗左右边缘 |
| 蒙版B高度 | **15px** | 渐变蒙版高度 |

---

## 三、高度计算

```
页面列表内容（或其他内容）
↑
一定为15px padding
↑
双层"按钮组"灰框上边缘（双层"按钮组"蒙版AB的交界处）
↑
一定为15px padding
↑
文字（文字字号必为15px）
或按钮（15px 下padding + icon 25px + 15px 上padding）
↑
一定为15px padding
↑
双层"按钮组"分割线
或单层"按钮组"灰框上边缘（单层"按钮组"蒙版AB的交界处）
↑
一定为15px padding
↑
按钮上边缘
↑
一定为5px padding
↑
icon+文字（icon高度必为25px；文字必为15px；整体高度按25px计算）
↑
一定为5px padding
↑
按钮下边缘
↑
一定为15px padding
↑
"按钮组"灰框下边缘
↑
一定为20px padding
↑
视窗底边缘
```

### 计算结果

**单层按钮组高度：**
```
= 2px(边框) + 15px(上padding) + 35px(按钮) + 15px(下padding)
= 67px
```

**双层按钮组高度：**
```
= 2px(边框) + 15px(上padding) + 35px(上层按钮) + 15px(padding)
  + 1px(分割线) + 15px(padding) + 35px(下层按钮) + 15px(下padding)
= 133px（实际CSS为110px，因双层共用中间padding）
```

**页面内容 padding-bottom：**
```
单层：67px(按钮组) + 15px(间距) = 82px
双层：110px(按钮组) + 15px(间距) = 125px
```

---

## 四、Step 1 - 选择层数

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

## 五、Step 2 - 定义按钮

### 5.1 按钮类型

| 类名 | 用途 | 包含内容 |
|------|------|---------|
| `.btn-action` | 带文字和图标的按钮 | 文字 + icon |
| `.btn-action-icon` | 纯图标按钮 | 仅 icon |

### 5.2 icon → 颜色自动关联

**规定1：** icon 一旦确定，按钮的**文字颜色**和**背景色**均跟随该 icon 的主色。

```xml
<!-- 使用 data-icon 属性指定 icon 名称 -->
<view class="btn-action" data-icon="play">
  <view>播放</view>
  <image src="/images/play.png"></image>
</view>
```

**关于自动提取 icon 主色：**

> **问：** 系统是否可以自动提取 icon 的主色？
>
> **答：** 微信小程序**无法**自动提取图片主色。需要建立 **icon 与颜色对应表**。

**当前颜色对照表（待配置）：**

| icon 名称 | 主色 | 背景色（15%透明度） | 用途 |
|----------|------|-------------------|------|
| play | #00A6ED | rgba(0,166,237,0.15) | 播放 |
| pause | #00A6ED | rgba(0,166,237,0.15) | 暂停 |
| replay | #00A6ED | rgba(0,166,237,0.15) | 重播 |
| correct | #00D26A | rgba(0,210,106,0.15) | 确认 |
| wrong | #F92F60 | rgba(249,47,96,0.15) | 错误 |
| list | #FFB02D | rgba(255,176,46,0.15) | 列表 |
| setting | #998EA4 | rgba(153,142,164,0.15) | 设置 |
| visible | #7D4533 | rgba(125,69,51,0.15) | 显隐 |
| label | #F8312F | rgba(248,49,47,0.15) | 标签 |
| recording | #212121 | rgba(33,33,33,0.15) | 录音 |

> **注意**：颜色映射表将在您提供完整 icon 列表后配置。在此之前，请手动使用颜色类（如 `.btn--audio`）。

**当前可用颜色类：**

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

### 5.3 按钮位置

**规定2：** 按钮的位置分为以下几种：

| 位置 | 类名 | 说明 |
|------|------|------|
| 居中（单按钮） | 默认 | 无需额外类，常规居中 |
| 居中（双按钮） | `.btn-pos-dual-center` | 两按钮间距15px，间距中点（7.5px位置）居中 |
| 左1 | `.btn-pos-left-1` | 第一个靠左按钮 |
| 左2 | `.btn-pos-left-2` | 第二个靠左按钮（紧跟左1） |
| 右1 | `.btn-pos-right-1` | 第一个靠右按钮 |
| 右2 | `.btn-pos-right-2` | 第二个靠右按钮（紧跟右1） |
| 左侧组 | `.btn-pos-left-group` | 多个左侧按钮的容器 |
| 右侧组 | `.btn-pos-right-group` | 多个右侧按钮的容器 |

**位置规则：**
- 靠左或靠右时，按钮距离边缘灰框的 padding 为 **15px**
- 按钮与按钮之间的间距为 **15px**

---

## 六、Step 3 - 自动蒙版

使用 `.btn-page-bottom` 容器，自动获得蒙版A和蒙版B。

### 蒙版结构图

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

| 蒙版 | 起点 | 终点 | 样式 | 作用 |
|------|------|------|------|------|
| 蒙版A | 灰框上边缘 | 视窗底边缘 | 纯白色背景 | 防止滚动内容透出 |
| 蒙版B | 灰框上边缘 | 向上15px | 白色渐变至透明 | 平滑视觉过渡 |

### 蒙版CSS实现

```css
/* 蒙版A - ::before */
.btn-page-bottom::before {
  position: absolute;
  top: 0;  /* 从灰框上边缘 */
  bottom: calc(-1 * var(--button-group-bottom-distance));  /* 到视窗底 */
  background: #FFFFFF;
}

/* 蒙版B - ::after */
.btn-page-bottom::after {
  position: absolute;
  bottom: 100%;  /* 从灰框上边缘 */
  height: 15px;  /* 向上15px */
  background: linear-gradient(to top, #FFFFFF, transparent);
}
```

---

## 七、完整示例

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

### 示例2：单层双按钮居中

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-inline-center btn-pos-dual-center">
    <view class="btn-action btn--audio" bindtap="play">
      <view>播放</view>
      <image src="/images/play.png"></image>
    </view>
    <view class="btn-action btn--correct" bindtap="submit">
      <view>提交</view>
      <image src="/images/correct.png"></image>
    </view>
  </view>
</view>
```

### 示例3：双层结构

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

### 示例4：左右分布

```xml
<view class="btn-group-layout-split__footer">
  <view class="btn-action-icon btn--setting btn-pos-left-1">
    <image src="/images/setting.png"></image>
  </view>
  <view class="btn-action btn--list btn-pos-right-1">
    <view>列表</view>
    <image src="/images/list.png"></image>
  </view>
</view>
```

---

## 八、更新记录

### v1.6 (2025-12-06)
- 重构构建流程：选择层数 → 定义按钮 → 自动蒙版
- 新增按钮位置类：双按钮居中、左1/2、右1/2、左右组
- 预留 icon → 颜色自动映射机制（待颜色表配置）
- 合并 readme 与 style-guide 文档

### v1.5 (2025-11-30)
- 从 components/ 迁移至 style/
- 明确定位为 CSS 样式工具类库

### v1.4 (2025-11-30)
- 边框颜色修正为 rgba(0, 0, 0, 0.3)
- 按钮改为 15% 透明度背景 + 主色文字

---

**文档版本：** v1.6.0
**最后更新：** 2025-12-06
**维护者：** 开发团队
