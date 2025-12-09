# 按钮组样式规范文档

微信小程序通用按钮组 **CSS 样式工具类库**，提供固定底部容器、多种布局模式和蒙版功能。

> **注意**：这是一个纯 CSS 样式库，不是微信小程序自定义组件。
> 通过 `@import` 引入样式后，直接在 wxml 中使用 CSS 类名即可。
> 推荐配合 `tap-action` 组件使用，自动封装点击动效。

**版本：** v1.8.0
**更新日期：** 2025-12-09
**样式文件：** `style/button-group.wxss`

---

## 快速引入

```css
/* app.wxss */
@import "style/button-group.wxss";
```

---

## 一、按钮构建流程

### 1.1 单独按钮（推荐方式）

使用 `tap-action` 组件，自动封装点击动效：

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

或使用 CSS 类名方式：

```xml
<view class="btn-action" data-icon="save" hover-class="tap-active" hover-stay-time="100" bindtap="onSave">
  <view>保存</view>
  <image src="/images/v2/save_bt.png"></image>
</view>
```

### 1.2 按钮组构建流程

```
┌─────────────────────────────────────────────────────────────────┐
│                     按钮组构建流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: 使用组件或基础类                                        │
│     ├─ <tap-action>     → 推荐，自动封装动效                     │
│     └─ .btn-action      → CSS类名方式                           │
│                                                                 │
│  Step 2: 指定颜色                                                │
│     └─ 添加 icon/data-icon="xxx" 属性，自动映射颜色              │
│        （基于 images/icon_color_mapping.json）                   │
│                                                                 │
│  Step 3: 可选布局                                                │
│     ├─ 单独使用：无需额外容器                                     │
│     └─ 按钮组：                                                  │
│           ├─ 一层：.btn-group-layout-inline-center               │
│           └─ 两层：.btn-group-layout-split                       │
│                                                                 │
│  Step 4: 可选固定底部                                            │
│     └─ 使用 .btn-page-bottom 容器                                │
│           ├─ 蒙版A：白色背景覆盖至视窗底                          │
│           └─ 蒙版B：渐变过渡                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、icon 颜色映射（核心功能）

### 2.1 映射机制

通过 `data-icon` 属性指定 icon 名称，自动应用对应的文字颜色和背景色。

**颜色映射表**（基于 `images/icon_color_mapping.json`）：

| data-icon | 主色 | 背景色 | 对应 icon |
|-----------|------|--------|-----------|
| `save` | #00A6ED | rgba(0,166,237,0.15) | save_bt.png |
| `play` | #00A6ED | rgba(0,166,237,0.15) | play_bt.png |
| `pause` | #00A6ED | rgba(0,166,237,0.15) | pause_bt.png |
| `replay` | #00A6ED | rgba(0,166,237,0.15) | replay_bt.png |
| `restart` | #00A6ED | rgba(0,166,237,0.15) | restart_bt.png |
| `submit` | #00A6ED | rgba(0,166,237,0.15) | submit_bt.png |
| `next` | #00A6ED | rgba(0,166,237,0.15) | next_bt.png |
| `goto` | #00A6ED | rgba(0,166,237,0.15) | goto_bt.png |
| `updown` | #00A6ED | rgba(0,166,237,0.15) | updown_bt.png |
| `correct` | #00D26A | rgba(0,210,106,0.15) | correct_bt.png |
| `flag` | #F8312F | rgba(248,49,47,0.15) | flag_bt.png |
| `visible` | #7D4533 | rgba(125,69,51,0.15) | visible_bt.png |
| `hidden` | #7D4533 | rgba(125,69,51,0.15) | hidden_bt.png |
| `list` | #FFB02E | rgba(255,176,46,0.15) | list_bt.png |
| `setting` | #998EA4 | rgba(153,142,164,0.15) | setting_bt.png |
| `me` | #533566 | rgba(83,53,102,0.15) | me_active.png |

### 2.2 使用示例

```xml
<!-- 蓝色保存按钮 -->
<view class="btn-action" data-icon="save">
  <view>保存</view>
  <image src="/images/v2/save_bt.png"></image>
</view>

<!-- 绿色确认按钮 -->
<view class="btn-action" data-icon="correct">
  <view>确认</view>
  <image src="/images/v2/correct_bt.png"></image>
</view>

<!-- 棕色显隐按钮（纯图标） -->
<view class="btn-action-icon" data-icon="visible">
  <image src="/images/v2/visible_bt.png"></image>
</view>
```

### 2.3 维护流程

新增 icon 时需同步更新两处：
1. `images/icon_color_mapping.json` - 添加 icon → 颜色映射
2. `style/button-group.wxss` - 添加对应的 `[data-icon="xxx"]` 选择器

---

## 三、标准数值（固定不变）

### 3.1 按钮内部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| icon 尺寸 | **25px** | 所有按钮图标统一尺寸 |
| 文字大小 | **15px** | 按钮文本字体大小 |
| 按钮内边距 | **5px** | 文字/图标与按钮边缘的距离 |
| 文字与图标间距 | **5px** | 同一按钮内文字和图标的间距 |
| 按钮高度 | **35px** | 5px(上) + 25px(icon) + 5px(下) |

### 3.2 按钮组容器数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 容器内边距 | **15px** | 按钮组容器与灰框边缘的距离 |
| 按钮间距 | **15px** | 相邻按钮之间的间距（gap） |
| 边框 | **1px solid** | 按钮组外边框 |
| 边框颜色 | **rgba(0,0,0,0.3)** | 灰色边框 |
| 容器圆角 | **9px** | 按钮组容器圆角半径 |

### 3.3 固定底部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 距视窗底部 | **20px** | 按钮组距视窗底边缘 |
| 距视窗左右 | **20px** | 按钮组距视窗左右边缘 |
| 蒙版B高度 | **15px** | 渐变蒙版高度 |

---

## 四、按钮类型

| 类名 | 用途 | 包含内容 |
|------|------|---------|
| `.btn-action` | 通用按钮样式 | 文字 + icon 或 仅 icon |
| `.btn-action-icon` | 向后兼容别名 | 等同于 .btn-action |
| `.btn-text-content` | 纯文字内容（无按钮） | 仅文字 |

> **推荐**：使用 `<tap-action>` 组件代替直接使用 CSS 类名。

### 4.1 纯文字层规范

当按钮组的一层中只有纯文字（无按钮）时，使用 `.btn-text-content` 类：

```xml
<view class="btn-group-layout-split__header btn-text-content">
  保持精听，越来越好
</view>
```

---

## 五、按钮组布局

### 5.1 一层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-inline-center">
    <view class="btn-action" data-icon="correct">
      <view>提交</view>
      <image src="/images/v2/correct_bt.png"></image>
    </view>
  </view>
</view>
```

### 5.2 两层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <view class="btn-group-layout-split__header">
      <!-- 上层按钮 -->
    </view>
    <view class="btn-group-layout-split__divider"></view>
    <view class="btn-group-layout-split__footer">
      <!-- 下层按钮 -->
    </view>
  </view>
</view>
```

---

## 六、按钮位置类

| 位置 | 类名 | 说明 |
|------|------|------|
| 居中 | `.btn-pos-center` | 任意数量按钮居中对齐 |
| 左1 | `.btn-pos-left-1` | 第一个靠左按钮 |
| 左2 | `.btn-pos-left-2` | 第二个靠左按钮 |
| 右1 | `.btn-pos-right-1` | 第一个靠右按钮 |
| 右2 | `.btn-pos-right-2` | 第二个靠右按钮 |
| 左侧组 | `.btn-pos-left-group` | 多个左侧按钮的容器 |
| 右侧组 | `.btn-pos-right-group` | 多个右侧按钮的容器 |

---

## 七、完整示例

### 示例1：单独按钮

```xml
<!-- 在任意位置使用，无需按钮组容器 -->
<view class="btn-action" data-icon="save" bindtap="onSave">
  <view>保存</view>
  <image src="/images/v2/save_bt.png"></image>
</view>
```

### 示例2：单层双按钮居中

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-inline-center btn-pos-center">
    <view class="btn-action" data-icon="play" bindtap="play">
      <view>播放</view>
      <image src="/images/v2/play_bt.png"></image>
    </view>
    <view class="btn-action" data-icon="correct" bindtap="submit">
      <view>提交</view>
      <image src="/images/v2/correct_bt.png"></image>
    </view>
  </view>
</view>
```

### 示例3：双层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-layout-split">
    <!-- 上层：纯文字 -->
    <view class="btn-group-layout-split__header btn-text-content">
      保持精听，越来越好
    </view>
    <view class="btn-group-layout-split__divider"></view>
    <!-- 下层：按钮 -->
    <view class="btn-group-layout-split__footer">
      <view class="btn-action" data-icon="save" bindtap="save">
        <view>保存并返回</view>
        <image src="/images/v2/save_bt.png"></image>
      </view>
    </view>
  </view>
</view>
```

---

## 八、更新记录

### v1.8.0 (2025-12-09)
- **组件重命名**：`btn-action` 组件更名为 `tap-action`
- **新增卡片模式**：`tap-action` 组件新增 `type="card"` 模式，仅提供点击动效
- **统一按钮样式**：`.btn-action` 和 `.btn-action-icon` 合并为统一的 `.btn-action`
- **职责分离**：点击动效由 `tap-action` 组件管理，样式库专注布局

### v1.7.1 (2025-12-07)
- **清理废弃代码**：移除 `.btn--audio`、`.btn--correct` 等10个废弃类
- **组件简化**：移除 `btn-action` 和 `btn-action-icon` 组件的废弃 `type` 属性
- **统一颜色方式**：所有按钮颜色均通过 `data-icon` 属性指定

### v1.7.0 (2025-12-07)
- **实现 icon 颜色映射机制**：通过 `data-icon` 属性自动映射颜色
- **全局迁移**：将所有页面的 `.btn--xxx` 迁移为 `data-icon` 方式
- **简化按钮定义**：只需基础类 + data-icon，无需记忆颜色类名
- 颜色映射基于 `images/icon_color_mapping.json` 配置

### v1.6.1 (2025-12-06)
- 新增 `.btn-pos-center` 通用居中类
- `__header` 和 `__footer` 仅提供基础布局

### v1.6.0 (2025-12-06)
- 重构构建流程
- 新增按钮位置类

### v1.5.0 (2025-11-30)
- 从 components/ 迁移至 style/
- 明确定位为 CSS 样式工具类库

---

**文档版本：** v1.8.0
**最后更新：** 2025-12-09
**维护者：** 开发团队
