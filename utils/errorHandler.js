/**
 * 错误处理工具
 * 统一封装五种错误处理策略
 *
 * 策略说明：
 * - 策略A【退回】：goBack() - 详情页、子页面初始化加载失败
 * - 策略B【重试】：showRetry() - 首页、列表页初始化加载失败
 * - 策略C【提示】：api.js 自动 toast，无需额外处理
 * - 策略D【静默】：空 catch，无需额外处理
 * - 策略E【结束进度】：finishProgress() - 非关键数据加载失败
 */

// 存储 goBack 的定时器，用于取消
let goBackTimer = null

/**
 * 结束所有加载状态（内部方法）
 * 自动检测并结束 pageLoading 和 audioLoading
 * @param {Object} page - 页面实例
 */
function finishAllLoading(page) {
  if (!page) return
  // 结束页面进度条
  if (page.finishLoading) {
    page.finishLoading()
  }
  // 结束音频加载遮罩
  if (page.finishAudioLoading) {
    page.finishAudioLoading()
  }
}

/**
 * 策略A：退回上一级
 * 适用场景：详情页、子页面初始化加载失败
 * 处理流程：结束加载状态 → 1.5秒后退回上一级
 *
 * @param {Object} page - 页面实例
 * @returns {number} 定时器ID，可用于取消
 *
 * @example
 * const errorHandler = getApp().errorHandler
 * api.request(...).catch(() => errorHandler.goBack(this))
 */
function goBack(page) {
  finishAllLoading(page)

  // 清除之前的定时器，防止重复触发
  if (goBackTimer) {
    clearTimeout(goBackTimer)
  }

  goBackTimer = setTimeout(() => {
    // 检查页面是否还在页面栈中
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
    }
    goBackTimer = null
  }, 1500)

  return goBackTimer
}

/**
 * 取消 goBack 的自动返回
 * 适用场景：用户在等待期间手动返回时调用
 */
function cancelGoBack() {
  if (goBackTimer) {
    clearTimeout(goBackTimer)
    goBackTimer = null
  }
}

/**
 * 策略B：显示重试按钮
 * 适用场景：首页、列表页初始化加载失败
 * 处理流程：结束加载状态 → 显示重试界面
 * 需配合 loadError Behavior 或手动定义 loadError 数据使用
 *
 * @param {Object} page - 页面实例
 *
 * @example
 * const errorHandler = getApp().errorHandler
 * api.request(...).catch(() => errorHandler.showRetry(this))
 */
function showRetry(page) {
  finishAllLoading(page)
  // 优先使用 Behavior 提供的方法
  if (page.showLoadError) {
    page.showLoadError()
  } else {
    page.setData({ loadError: true })
  }
}

/**
 * 策略E：仅结束进度
 * 适用场景：非关键数据加载失败
 * 处理流程：仅结束加载状态，不做其他处理
 *
 * @param {Object} page - 页面实例
 *
 * @example
 * const errorHandler = getApp().errorHandler
 * api.request(...).catch(() => errorHandler.finishProgress(this))
 */
function finishProgress(page) {
  finishAllLoading(page)
}

/**
 * 重置页面状态并重新加载
 * 统一处理状态重置，避免遗漏
 *
 * @param {Object} page - 页面实例
 * @param {string} loadMethod - 加载方法名（可选）
 *
 * @example
 * const errorHandler = getApp().errorHandler
 * // 在 retryLoad 中使用
 * retryLoad() {
 *   errorHandler.resetAndReload(this, 'listData')
 * }
 */
function resetAndReload(page, loadMethod) {
  if (!page) return

  // 隐藏错误状态
  if (page.hideLoadError) {
    page.hideLoadError()
  } else if (page.setData) {
    page.setData({ loadError: false })
  }

  // 开始加载动画
  if (page.startLoading) {
    page.startLoading()
  }

  // 重置音频加载状态
  if (page.finishAudioLoading) {
    page.finishAudioLoading()
  }

  // 执行加载方法
  if (loadMethod && typeof page[loadMethod] === 'function') {
    page[loadMethod]()
  }
}

module.exports = {
  goBack,
  cancelGoBack,
  showRetry,
  finishProgress,
  resetAndReload
}
