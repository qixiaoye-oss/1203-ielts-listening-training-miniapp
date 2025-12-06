# 更新日志 (Changelog)

本文档记录按钮组样式库的所有重要更新。

---

## [1.6.0] - 2025-12-06

### ✨ 新增 (Added)
- **按钮位置类**：新增完整的按钮位置控制系统
  - `.btn-pos-dual-center`：双按钮居中（间距中点居中）
  - `.btn-pos-left-1`：靠左第1个按钮
  - `.btn-pos-left-2`：靠左第2个按钮
  - `.btn-pos-right-1`：靠右第1个按钮
  - `.btn-pos-right-2`：靠右第2个按钮
  - `.btn-pos-left-group`：左侧按钮组容器
  - `.btn-pos-right-group`：右侧按钮组容器
- **icon颜色映射机制（预留）**：准备使用 `data-icon` 属性自动应用主色

### 🔄 变更 (Changed)
- **构建流程重构**：明确三步构建流程
  1. Step 1: 选择层数（一层/两层）
  2. Step 2: 定义按钮（指定icon自动应用主色 + 指定位置）
  3. Step 3: 自动蒙版（使用.btn-page-bottom自动获得蒙版A+B）
- **文档重组**：README.md 按照构建流程重新组织

### 📝 位置规范 (Position Spec)
- 居中（单按钮）：常规居中，无需额外类
- 居中（双按钮）：两按钮间距15px，间距中点（7.5px位置）永远保持居中
- 靠左/靠右时，按钮距离边缘灰框的 padding 为 15px
- 按钮与按钮之间的间距为 15px

### 🎯 影响范围 (Scope)
- button-group.wxss 新增位置类（第6节）和icon映射预留（第7节）
- README.md 完全重写，按构建流程组织
- CHANGELOG.md 添加本次更新记录

### 💡 设计理念 (Design)
- **标准化流程**：按钮组构建遵循严格标准，确保一致性
- **icon驱动颜色**：icon一旦确定，文字颜色和背景色自动跟随主色
- **位置可控**：提供完整的位置控制类，支持居中、左1/2、右1/2

---

## [1.5.0] - 2025-11-30

### 🔄 变更 (Changed)
- **目录迁移**：从 `components/button-group/` 迁移至 `style/button-group/`
- **定位澄清**：明确定位为"CSS 样式工具类库"而非"小程序自定义组件"
- **文档更新**：README 标题和说明更新，强调这是纯 CSS 实现

### 📝 变更原因 (Rationale)
- `button-group` 只包含 `.wxss` 样式文件，没有 `.js`/`.json`/`.wxml`
- 不符合微信小程序自定义组件的标准结构
- 放在 `style/` 目录下更符合其本质（样式工具类库）
- 与真正的组件（如 `toggle-control-group`）形成清晰区分

### 🎯 影响范围 (Scope)
- `app.wxss` 引用路径更新
- `style/theme.wxss` 注释路径更新
- `docs/button-group-style-guide.md` 所有路径更新
- `README.md` 标题和说明更新

---

## [1.4.0] - 2025-11-30

### 🔄 变更 (Changed)
- **边框颜色修正**：边框颜色统一使用 `rgba(0, 0, 0, 0.3)`
- **按钮背景色重构**：所有按钮改为 15% 透明度背景 + 主色文字
  - 从：实心背景 + 白色文字
  - 改为：15% 透明度背景 + 主色文字
- **禁用状态简化**：`.btn--dis` 仅保留 `opacity: 0.3`
- **删除重复定义**：从 `theme.wxss` 删除 `.btn-page-bottom` 定义（32行）
  - 确保组件完全独立，无外部依赖

### 📝 详细变更 (Details)
**边框和分割线：**
- `--button-group-border-color: rgba(0, 0, 0, 0.3)`

**按钮颜色类（新实现）：**
- `.btn--audio`: `color: #00A6ED; background-color: rgba(0, 166, 237, 0.15);`
- `.btn--correct`: `color: #00D26A; background-color: rgba(0, 210, 106, 0.15);`
- `.btn--wrong`: `color: #F92F60; background-color: rgba(249, 47, 96, 0.15);`
- `.btn--list`: `color: #FFB02D; background-color: rgba(255, 176, 46, 0.15);`
- `.btn--setting`: `background-color: rgba(153, 142, 164, 0.15);`
- `.btn--visible`: `background-color: rgba(125, 69, 51, 0.15);`
- `.btn--label`: `color: #F8312F; background-color: rgba(248, 49, 47, 0.15);`
- `.btn--recording`: `color: #212121; background-color: rgba(33, 33, 33, 0.15);`
- `.btn--practice`: `color: #433B6B; background-color: rgba(67, 59, 107, 0.15);`
- `.btn--exercise`: `color: #533566; background-color: rgba(83, 53, 102, 0.15);`
- `.btn--dis`: `opacity: 0.3;`

### 🎯 影响范围 (Scope)
- 所有使用按钮组组件的页面
- 按钮视觉效果更加轻盈透明
- 组件完全独立，可复用到其他项目

### 💡 设计理念 (Design)
- **透明度设计**：按钮使用 15% 透明度背景，更轻盈现代
- **色彩一致性**：文字颜色与背景主色一致，视觉更协调
- **完全独立**：所有样式值直接定义，零外部依赖
- **跨项目复用**：可直接复制到其他小程序项目使用

### 📦 提交记录 (Commits)
- `760fe94` - refactor: 删除theme.wxss中btn-page-bottom的重复定义
- `052a983` - feat: 按钮组组件颜色规范修正 v1.4.0

---

## [1.3.0] - 2025-11-30

### ✨ 新增 (Added)
- **独立样式包**：提取为独立的样式目录（现位于 `style/button-group/`）
- **零外部依赖**：使用 CSS 变量消除所有外部依赖，开箱即用
- **完整文档**：新增 README.md 使用说明和 CHANGELOG.md 版本记录
- **版本管理**：在样式文件头部添加版本号和更新日志

### 🔄 变更 (Changed)
- **统一实现**：所有页面统一使用 `.btn-page-bottom` 容器类
- **CSS 变量化**：所有配置项改为 CSS 变量，支持灵活自定义
- **蒙版定位优化**：使用 `calc()` 函数动态计算蒙版位置

### 🗑️ 移除 (Removed)
- 删除 `article-page__footer` 及其蒙版样式（34行）
- 删除 `report-card-page__footer` 及其蒙版样式（34行）
- 消除对 `--solid-border-color` 等外部变量的依赖

### 🐛 修复 (Fixed)
- 修正双层按钮组蒙版A从顶部边框外边缘开始
- 调整双层按钮组蒙版B紧贴蒙版A上边缘

### 📝 文档 (Documentation)
- 新增完整的 README.md 使用说明
- 新增 CHANGELOG.md 版本更新记录
- 更新 `docs/button-group-style-guide.md` 至 v1.3

### 🎯 影响范围 (Scope)
- intensive 页面（已统一）
- extensive 页面（已统一）
- practice 页面（已统一）
- article 页面（新增，已统一）
- report-card 页面（已统一）

---

## [1.2.0] - 2025-11-29

### ✨ 新增 (Added)
- **固定底部逻辑**：确立按钮组固定底部为统一逻辑
- **蒙版系统**：添加蒙版A（白色背景）和蒙版B（白色渐变）
- **位置一致性原则**：新增设计原则"位置一致性原则"

### 🔄 变更 (Changed)
- 所有常规按钮组固定在页面底部，距底部20px
- 按钮组不随页面内容滚动，始终可见

### 📝 文档 (Documentation)
- 新增章节"固定底部按钮组实现方式"（2.4）
- 更新 `docs/button-group-style-guide.md` 至 v1.2

### 🎯 影响范围 (Scope)
- report-card 页面完成固定底部实现

### 📋 提交记录 (Commits)
- `0fa1734` - fix: report-card页面返回逻辑和按钮组布局优化
- `5302d61` - fix: report-card页面按钮组固定在底部不滚动
- `e61e21f` - fix: 优化report-card页面滚动逻辑

---

## [1.1.0] - 2025-11-29

### 🔄 变更 (Changed)
- **统一按钮间距**：将所有按钮组的按钮间距（gap）从 `10px` 统一调整为 `15px`

### 🎯 影响范围 (Scope)
- `.btn-group-layout-split__header`
- `.btn-group-layout-split__footer`
- `.btn-group-layout-inline-center`
- `.btn-group-embedded`（explanation页面）

### 📋 提交记录 (Commits)
- `bcede32` - fix: 统一按钮组按钮间距为15px

---

## [1.0.0] - 初始版本

### ✨ 初始功能 (Initial Features)
- 基础按钮样式（`.btn-action`, `.btn-action-icon`）
- 双层结构布局（`.btn-group-layout-split`）
- 单行居中布局（`.btn-group-layout-inline-center`）
- 10种功能色彩类
- 按钮组基础规范

---

## 版本号说明

版本号格式：`主版本号.次版本号.修订号`

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

---

## 更新类型说明

- ✨ **新增 (Added)**：新功能
- 🔄 **变更 (Changed)**：对现有功能的变更
- 🗑️ **移除 (Removed)**：移除的功能
- 🐛 **修复 (Fixed)**：Bug 修复
- 📝 **文档 (Documentation)**：仅文档更改
- 🎯 **影响范围 (Scope)**：受影响的页面或组件
- 📋 **提交记录 (Commits)**：相关的 Git 提交
