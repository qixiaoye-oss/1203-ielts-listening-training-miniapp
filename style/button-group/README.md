# 按钮组样式库 (Button Group Styles)

微信小程序通用按钮组 **CSS 样式工具类库**，提供固定底部容器、多种布局模式和蒙版功能。

> **注意**：这是一个纯 CSS 样式库，不是微信小程序自定义组件。
> 通过 `@import` 引入样式后，直接在 wxml 中使用 CSS 类名即可。

## 版本

**当前版本：** v1.5.0
**发布日期：** 2025-11-30

## 特性

- ✅ **纯 CSS 实现**，无需 js/json/wxml 文件
- ✅ **高度灵活**，自由组合结构和样式
- ✅ 固定底部按钮组容器（含蒙版A和蒙版B）
- ✅ 双层结构布局（split）
- ✅ 单行居中布局（inline-center）
- ✅ 基础按钮样式（带图标、纯图标）
- ✅ 10种功能色彩类
- ✅ **零外部依赖**，开箱即用
- ✅ **CSS变量配置**，灵活自定义
- ✅ 完整的蒙版系统，平滑视觉过渡

---

## 快速开始

### 1. 引入样式

在 `app.wxss` 中引入按钮组样式：

```css
@import "style/button-group/button-group.wxss";
```

### 2. 使用按钮组

#### 示例1：固定底部单按钮

```xml
<view class="page">
  <view class="page__content">
    <!-- 页面内容 -->
  </view>

  <!-- 固定底部按钮组 -->
  <view class="btn-page-bottom">
    <view class="btn-group-layout-inline-center">
      <view class="btn-action btn--correct" bindtap="submit">
        <view>提交</view>
        <image src="/images/submit.png"></image>
      </view>
    </view>
  </view>
</view>
```

```css
/* page.wxss */
.page__content {
  padding-bottom: 82px; /* 单层按钮组：67px + 15px = 82px */
}
```

#### 示例2：固定底部双层按钮

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <!-- 上层按钮 -->
    <view class="btn-group-layout-split__header">
      <view class="btn-action btn--audio" bindtap="play">
        <view>播放</view>
        <image src="/images/play.png"></image>
      </view>
      <view class="btn-action btn--correct" bindtap="submit">
        <view>提交</view>
        <image src="/images/submit.png"></image>
      </view>
    </view>

    <!-- 分割线 -->
    <view class="btn-group-layout-split__divider"></view>

    <!-- 下层按钮 -->
    <view class="btn-group-layout-split__footer">
      <view class="btn-action-icon btn--setting" bindtap="openSettings">
        <image src="/images/setting.png"></image>
      </view>
      <view class="btn-action btn--list" bindtap="showList">
        <view>列表</view>
        <image src="/images/list.png"></image>
      </view>
    </view>
  </view>
</view>
```

```css
/* page.wxss */
.page__content {
  padding-bottom: 125px; /* 双层按钮组：110px + 15px = 125px */
}
```

---

## 样式架构

### `.btn-page-bottom` - 固定底部容器

完整的固定底部按钮组容器，包含三个核心部分：

| 部分 | 实现 | 作用 |
|------|------|------|
| 容器 | `.btn-page-bottom` | 固定定位在视窗底部 |
| 蒙版A | `::before` | 白色背景，覆盖到视窗底部 |
| 蒙版B | `::after` | 白色渐变，平滑视觉过渡 |

### 按钮组布局

| 类名 | 用途 | 适用场景 |
|------|------|---------|
| `.btn-group-layout-split` | 双层结构 | 按钮数量 > 3 或需要区分层级 |
| `.btn-group-layout-inline-center` | 单行居中 | 按钮数量 ≤ 3 且同等重要 |

### 按钮样式

| 类名 | 用途 | 包含内容 |
|------|------|---------|
| `.btn-action` | 带文字和图标的按钮 | 文字 + 图标 |
| `.btn-action-icon` | 纯图标按钮 | 仅图标 |

### 功能色彩类

| 类名 | 颜色 | 用途 |
|------|------|------|
| `.btn--audio` | 蓝色 #00A6ED | 音频播放相关 |
| `.btn--correct` | 绿色 #00D26A | 正确答案、确认 |
| `.btn--wrong` | 红色 #F92F60 | 错误答案、删除 |
| `.btn--list` | 黄色 #FFB02D | 列表、导航 |
| `.btn--setting` | 紫灰 #998EA4 | 设置、配置 |
| `.btn--visible` | 棕色 #7D4533 | 显示/隐藏切换 |
| `.btn--label` | 红色 #F8312F | 标记、标签 |
| `.btn--recording` | 黑色 #212121 | 录音相关 |
| `.btn--practice` | 深紫 #433B6B | 练习模式 |
| `.btn--exercise` | 紫色 #533566 | 习题练习 |
| `.btn--dis` | 灰色 #CCCCCC | 禁用状态 |

---

## 自定义配置

### 覆盖默认配置

在 `app.wxss` 或页面 `wxss` 中覆盖 CSS 变量：

```css
@import "style/button-group/button-group.wxss";

/* 自定义配置 */
page {
  /* 修改边框颜色 */
  --button-group-border-color: #CCCCCC;

  /* 修改蒙版背景色 */
  --button-group-mask-bg: #F5F5F5;

  /* 修改按钮间距 */
  --button-group-gap: 20px;

  /* 修改功能色彩 */
  --button-color-audio: #0088CC;
  --button-color-correct: #00AA00;
}
```

### 可配置变量列表

<details>
<summary>点击查看完整配置变量</summary>

```css
/* 基础配置 */
--button-group-border-width: 1px;
--button-group-border-color: #E5E5E5;
--button-group-border-radius: 9px;
--button-group-padding: 15px;
--button-group-gap: 15px;

/* 按钮配置 */
--button-font-size: 15px;
--button-line-height: 15px;
--button-padding: 5px;
--button-border-radius: 3px;
--button-icon-size: 25px;
--button-icon-margin: 5px;

/* 固定底部配置 */
--button-group-bottom-distance: 20px;
--button-group-left-distance: 20px;
--button-group-right-distance: 20px;
--button-group-z-index: 100;

/* 蒙版配置 */
--button-group-mask-bg: #FFFFFF;
--button-group-mask-gradient-height: 15px;

/* 功能色彩 */
--button-color-audio: #00A6ED;
--button-color-correct: #00D26A;
--button-color-wrong: #F92F60;
--button-color-list: #FFB02D;
--button-color-setting: #998EA4;
--button-color-visible: #7D4533;
--button-color-label: #F8312F;
--button-color-recording: #212121;
--button-color-practice: #433B6B;
--button-color-exercise: #533566;
--button-color-disabled: #CCCCCC;
```

</details>

---

## 高度计算

为避免固定底部按钮组遮挡内容，需要为页面内容设置 `padding-bottom`：

### 计算公式

```
padding-bottom = 按钮组高度 + 内容与按钮组间距(15px)
```

### 常见高度

| 布局类型 | 按钮组高度 | padding-bottom |
|---------|-----------|----------------|
| 单层按钮组 | 67px | 82px (67 + 15) |
| 双层按钮组 | 110px | 125px (110 + 15) |

### 按钮组高度计算

```
单层高度 = (上下padding × 2) + (按钮高度) + (边框 × 2)
        = (15 × 2) + 35 + (1 × 2)
        = 67px

双层高度 = (上下padding × 2) + (按钮高度 × 2) + 分割线 + (边框 × 2)
        = (15 × 2) + (35 × 2) + 1 + (1 × 2)
        = 110px
```

---

## 复制到其他项目

### 步骤1：复制文件

```bash
cp -r template-project/style/button-group ./style/
```

### 步骤2：引入样式

在目标项目的 `app.wxss` 中引入：

```css
@import "style/button-group/button-group.wxss";
```

### 步骤3：使用样式类

参考上方"快速开始"部分的示例代码，直接在 wxml 中使用 CSS 类名。

---

## 注意事项

1. **零外部依赖**：样式库已内置所有必需的 CSS 变量，无需额外配置
2. **蒙版必要性**：蒙版A和蒙版B是固定底部按钮组的必要组成部分，自动生效
3. **图标资源**：需要自行准备图标图片资源
4. **padding-bottom**：使用固定底部按钮组时，务必设置页面内容的 padding-bottom

---

## 常见问题

**Q: 如何修改按钮间距？**
A: 覆盖 `--button-group-gap` 变量。

**Q: 如何修改蒙版背景色？**
A: 覆盖 `--button-group-mask-bg` 变量，适配非白色背景的项目。

**Q: 如何禁用某个按钮？**
A: 添加 `.btn--dis` 类，按钮将显示为灰色并禁用交互。

**Q: 可以不使用蒙版吗？**
A: 不建议。蒙版A和蒙版B是固定底部按钮组的必要组成部分，确保视觉效果和用户体验。

---

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本更新记录。

---

## 许可证

内部项目使用

---

## 相关文档

- [按钮组样式规范文档](../../docs/button-group-style-guide.md)
