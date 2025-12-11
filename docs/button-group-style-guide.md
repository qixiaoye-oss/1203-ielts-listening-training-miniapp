# 按钮组样式规范文档

微信小程序通用按钮组 **CSS 样式工具类库**，提供固定底部容器、多种布局模式和蒙版功能。

> **注意**：这是一个纯 CSS 样式库，不是微信小程序自定义组件。
> 通过 `@import` 引入样式后，直接在 wxml 中使用 CSS 类名即可。
> 推荐配合 `tap-action` 组件使用，自动封装点击动效。

**版本：** v2.1.0
**更新日期：** 2025-12-11
**样式文件：** `style/button-group.wxss`
**点击组件：** `components/tap-action`

---

## 快速引入

```css
/* app.wxss */
@import "style/button-group.wxss";
```

```json
/* app.json 或页面 json */
{
  "usingComponents": {
    "tap-action": "/components/tap-action/index"
  }
}
```

---

## 一、tap-action 组件

### 1.1 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | String | `button` | 模式：`button`（按钮）/ `card`（卡片） |
| `icon` | String | `''` | icon 名称，用于颜色映射（仅 button 模式） |
| `disabled` | Boolean | `false` | 是否禁用 |

### 1.2 按钮模式（默认）

```xml
<!-- 文字+图标按钮 -->
<tap-action icon="save" bind:tap="onSave">
  <view>保存</view>
  <image src="/images/v2/save_bt.png"></image>
</tap-action>

<!-- 纯图标按钮 -->
<tap-action icon="play" bind:tap="onPlay">
  <image src="/images/v2/play_bt.png"></image>
</tap-action>
```

### 1.3 卡片模式

卡片模式仅提供点击动效，不应用按钮样式：

```xml
<tap-action type="card" bind:tap="onCardTap">
  <view class="my-card">
    <!-- 卡片内容 -->
  </view>
</tap-action>
```

---

## 二、icon 颜色映射

### 2.1 映射机制

通过 `icon` 属性（或 `data-icon`）指定 icon 名称，自动应用对应的文字颜色和背景色。

**颜色映射表**：

| icon | 主色 | 背景色 | 用途 |
|------|------|--------|------|
| `save` | #00A6ED | rgba(0,166,237,0.15) | 保存 |
| `play` | #00A6ED | rgba(0,166,237,0.15) | 播放 |
| `pause` | #00A6ED | rgba(0,166,237,0.15) | 暂停 |
| `replay` | #00A6ED | rgba(0,166,237,0.15) | 重播 |
| `restart` | #00A6ED | rgba(0,166,237,0.15) | 重新开始 |
| `submit` | #00A6ED | rgba(0,166,237,0.15) | 提交 |
| `next` | #00A6ED | rgba(0,166,237,0.15) | 下一个 |
| `goto` | #00A6ED | rgba(0,166,237,0.15) | 跳转 |
| `updown` | #00A6ED | rgba(0,166,237,0.15) | 上下切换 |
| `go` | #00A6ED | rgba(0,166,237,0.15) | 前往 |
| `stop` | #00A6ED | rgba(0,166,237,0.15) | 停止 |
| `down` | #00A6ED | rgba(0,166,237,0.15) | 下载 |
| `correct` | #00D26A | rgba(0,210,106,0.15) | 正确答案 |
| `flag` | #F8312F | rgba(248,49,47,0.15) | 标记 |
| `medal` | #F8312F | rgba(248,49,47,0.15) | 勋章 |
| `visible` | #7D4533 | rgba(125,69,51,0.15) | 显示 |
| `hidden` | #7D4533 | rgba(125,69,51,0.15) | 隐藏 |
| `list` | #FFB02E | rgba(255,176,46,0.15) | 列表 |
| `setting` | #998EA4 | rgba(153,142,164,0.15) | 设置 |
| `me` | #533566 | rgba(83,53,102,0.15) | 个人中心 |
| `controller` | #433B6B | rgba(67,59,107,0.15) | 练习/打卡 |
| `desktop_mic` | #212121 | rgba(33,33,33,0.15) | 录音 |

### 2.2 维护流程

新增 icon 时需同步更新两处：
1. `images/v2/icon_color_mapping.json` - 添加 icon → 颜色映射
2. `style/button-group.wxss` - 添加对应的 `[data-icon="xxx"]` 选择器

---

## 三、按钮角标 (Corner Mark)

按钮角标用于显示数量提示（如录音数量）。

### 3.1 基础用法

```xml
<tap-action icon="controller" bind:tap="handleTap">
  <view>打卡/录音</view>
  <image src="/images/v2/controller_bt.png"></image>
  <view class="btn-corner-mark" wx:if="{{count > 0}}">{{count}}</view>
</tap-action>
```

### 3.2 颜色自动继承

角标颜色会**自动继承**父元素 `data-icon` 的主色，无需手动指定颜色类或 inline style。

**CSS 规则：**

```css
/* 角标颜色 - 自动继承 data-icon 主色 */
[data-icon="controller"] .btn-corner-mark {
  color: #433B6B;
  border-color: #433B6B;
}

[data-icon="desktop_mic"] .btn-corner-mark {
  color: #212121;
  border-color: #212121;
}

[data-icon="save"] .btn-corner-mark,
[data-icon="play"] .btn-corner-mark,
[data-icon="go"] .btn-corner-mark {
  color: #00A6ED;
  border-color: #00A6ED;
}
```

### 3.3 角标颜色对照表

| 父元素 icon | 角标颜色 | 色值 |
|-------------|----------|------|
| `controller` | 紫色 | #433B6B |
| `desktop_mic` | 黑色 | #212121 |
| `save` / `play` / `go` | 蓝色 | #00A6ED |

### 3.4 兼容旧版（不推荐）

旧版通过添加颜色类实现，现已不推荐使用：

```xml
<!-- 旧版写法 - 不推荐 -->
<view class="btn-corner-mark btn--recording-corner-mark">{{count}}</view>
<view class="btn-corner-mark btn--practice-corner-mark">{{count}}</view>
```

---

## 四、按钮位置类

### 4.1 位置类说明

| 类名 | 用途 | 特性 |
|------|------|------|
| `.btn-pos-left` | 左侧按钮组 | 支持多个按钮，自动 15px 间距，整体靠左 |
| `.btn-pos-right` | 右侧按钮组 | 支持多个按钮，自动 15px 间距，整体靠右 |
| `.btn-pos-center` | 居中按钮组 | 支持多个按钮，自动 15px 间距，整体居中 |

### 4.2 使用场景

**场景1：全部按钮居中**

```xml
<view class="btn-group-layout-split__header btn-pos-center">
  <tap-action icon="replay">重播</tap-action>
  <tap-action icon="play">播放</tap-action>
  <tap-action icon="next">下句</tap-action>
</view>
```

**场景2：左右分布**

```xml
<view class="btn-group-layout-split__footer">
  <view class="btn-pos-left">
    <tap-action icon="setting">
      <image src="/images/v2/setting_bt.png"></image>
    </tap-action>
    <tap-action icon="visible">
      <image src="/images/v2/visible_bt.png"></image>
    </tap-action>
  </view>
  <view class="btn-pos-right">
    <tap-action icon="list">
      <view>句子列表</view>
      <image src="/images/v2/list_bt.png"></image>
    </tap-action>
  </view>
</view>
```

**场景3：仅右侧（卡片内按钮）**

```xml
<view class="btn-pos-right">
  <tap-action icon="play" bind:tap="playAudio">
    <image src="/images/v2/play_bt.png"></image>
  </tap-action>
  <tap-action icon="goto" bind:tap="toDetail">
    <image src="/images/v2/goto_bt.png"></image>
  </tap-action>
</view>
```

### 4.3 灵活组合

位置类支持任意组合，左右各可放置单个或多个按钮：

```
┌─────────────────────────────────────────────────────────────┐
│  [左1] [左2]                              [右1] [右2] [右3]  │
│  └─ btn-pos-left ─┘                      └─ btn-pos-right ─┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 五、标准数值

### 5.1 按钮内部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| icon 尺寸 | **25px** | 所有按钮图标统一尺寸 |
| 文字大小 | **15px** | 按钮文本字体大小 |
| 按钮内边距 | **5px** | 文字/图标与按钮边缘的距离 |
| 文字与图标间距 | **5px** | 同一按钮内文字和图标的间距 |
| 按钮高度 | **35px** | 5px(上) + 25px(icon) + 5px(下) |

### 5.2 按钮组容器数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 容器内边距 | **15px** | 按钮组容器与灰框边缘的距离 |
| 按钮间距 | **15px** | 相邻按钮之间的间距（gap） |
| 边框 | **1px solid** | 按钮组外边框 |
| 边框颜色 | **rgba(0,0,0,0.3)** | 灰色边框 |
| 容器圆角 | **9px** | 按钮组容器圆角半径 |

### 5.3 固定底部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 距视窗底部 | **20px** | 按钮组距视窗底边缘 |
| 距视窗左右 | **20px** | 按钮组距视窗左右边缘 |
| 蒙版B高度 | **15px** | 渐变蒙版高度 |

---

## 六、按钮组布局

### 6.1 一层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-inline-center">
    <tap-action icon="correct" bind:tap="submit">
      <view>提交</view>
      <image src="/images/v2/correct_bt.png"></image>
    </tap-action>
  </view>
</view>
```

### 6.2 两层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <!-- 上层 -->
    <view class="btn-group-layout-split__header btn-pos-center">
      <tap-action icon="replay">重播</tap-action>
      <tap-action icon="play">播放</tap-action>
      <tap-action icon="next">下句</tap-action>
    </view>
    <!-- 分割线 -->
    <view class="btn-group-layout-split__divider"></view>
    <!-- 下层 -->
    <view class="btn-group-layout-split__footer">
      <view class="btn-pos-left">
        <tap-action icon="setting">
          <image src="/images/v2/setting_bt.png"></image>
        </tap-action>
      </view>
      <view class="btn-pos-right">
        <tap-action icon="list">
          <view>句子列表</view>
          <image src="/images/v2/list_bt.png"></image>
        </tap-action>
      </view>
    </view>
  </view>
</view>
```

### 6.3 纯文字层

```xml
<view class="btn-group-layout-split__header btn-text-content">
  保持精听，越来越好
</view>
```

---

## 七、完整示例

### 示例1：精听页面按钮组

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <view class="btn-group-layout-split__header btn-pos-center">
      <tap-action icon="replay" bind:tap="listenAgain">
        <view>重播</view>
        <image src="/images/v2/replay_bt.png"></image>
      </tap-action>
      <tap-action icon="play" bind:tap="playAudio">
        <view>播放</view>
        <image src="/images/v2/play_bt.png"></image>
      </tap-action>
      <tap-action icon="next" bind:tap="nextSentence">
        <view>下句</view>
        <image src="/images/v2/next_bt.png"></image>
      </tap-action>
      <tap-action icon="correct" bind:tap="markCorrect">
        <view>听懂</view>
        <image src="/images/v2/correct_bt.png"></image>
      </tap-action>
    </view>
    <view class="btn-group-layout-split__divider"></view>
    <view class="btn-group-layout-split__footer">
      <view class="btn-pos-left">
        <tap-action icon="setting" bind:tap="playSet">
          <image src="/images/v2/setting_bt.png"></image>
        </tap-action>
        <tap-action icon="visible" bind:tap="toggleVisible">
          <image src="/images/v2/visible_bt.png"></image>
        </tap-action>
      </view>
      <view class="btn-pos-right">
        <tap-action icon="list" bind:tap="toList">
          <view>句子列表</view>
          <image src="/images/v2/list_bt.png"></image>
        </tap-action>
      </view>
    </view>
  </view>
</view>
```

### 示例2：卡片内按钮（居右）

```xml
<view class="card">
  <view class="card-content">...</view>
  <view class="btn-pos-right">
    <tap-action icon="play" bind:tap="playAudio">
      <image src="/images/v2/play_bt.png"></image>
    </tap-action>
    <tap-action icon="goto" bind:tap="toDetail">
      <image src="/images/v2/goto_bt.png"></image>
    </tap-action>
  </view>
</view>
```

### 示例3：卡片点击效果

```xml
<tap-action type="card" bind:tap="onCardTap">
  <view class="home-card">
    <view class="home-card__content">
      <view class="home-card__title">卡片标题</view>
      <view class="home-card__desc">卡片描述</view>
    </view>
  </view>
</tap-action>
```

### 示例4：带角标的按钮

```xml
<tap-action icon="controller" bind:tap="handleTap">
  <view>打卡/录音</view>
  <image src="/images/v2/controller_bt.png"></image>
  <view class="btn-corner-mark" wx:if="{{recordCount > 0}}">{{recordCount}}</view>
</tap-action>
```

---

## 八、更新记录

### v2.1.0 (2025-12-11)
- **新增角标颜色继承**：角标颜色自动继承父元素 `data-icon` 主色
- **新增 icon 映射**：`go`、`stop`、`down`（蓝色）、`medal`（红色）、`controller`（紫色）、`desktop_mic`（黑色）

### v2.0.0 (2025-12-09)
- **重构位置类**：使用 `.btn-pos-left`、`.btn-pos-right`、`.btn-pos-center` 包裹类
- **支持多按钮**：每个位置类支持包含任意数量按钮，自动 15px 间距
- **修复独立使用**：`.btn-pos-right` 添加 `justify-content: flex-end`，支持非 flex 父容器
- **移除旧类名**：废弃 `.btn-pos-left-1`、`.btn-pos-right-1` 等单按钮类名

### v1.9.0 (2025-12-09)
- **全局迁移**：所有页面迁移到 `<tap-action>` 组件方式
- **移除废弃类**：删除 `.btn-action-icon` 类（已无使用）
- **简化架构**：统一使用组件封装点击效果

### v1.8.0 (2025-12-09)
- **组件重命名**：`btn-action` 组件更名为 `tap-action`
- **新增卡片模式**：`tap-action` 组件新增 `type="card"` 模式
- **职责分离**：点击动效由 `tap-action` 组件管理，样式库专注布局

### v1.7.0 (2025-12-07)
- **实现 icon 颜色映射机制**：通过 `data-icon` 属性自动映射颜色
- **全局迁移**：将所有页面的 `.btn--xxx` 迁移为 `data-icon` 方式

---

**文档版本：** v2.1.0
**最后更新：** 2025-12-11
**维护者：** 开发团队
