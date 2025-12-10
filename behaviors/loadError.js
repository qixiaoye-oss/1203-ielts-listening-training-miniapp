/**
 * 加载失败重试 Behavior
 * 用于策略B：显示重试按钮
 *
 * 使用方式：
 * 1. 在页面 JS 中引入：const loadError = require('../../behaviors/loadError')
 * 2. 添加到 behaviors：behaviors: [pageLoading, loadError]
 * 3. 在 WXML 中引入模板：<import src="/templates/load-error.wxml" />
 * 4. 使用模板：<template is="loadError" data="{{loadError, loadErrorText}}" />
 * 5. 实现 retryLoad 方法
 */
module.exports = Behavior({
  data: {
    loadError: false,
    loadErrorText: '加载失败'
  },

  methods: {
    /**
     * 显示加载失败状态
     * @param {string} text - 自定义错误提示文案（可选）
     */
    showLoadError(text) {
      const data = { loadError: true }
      if (text) {
        data.loadErrorText = text
      }
      this.setData(data)
    },

    /**
     * 隐藏加载失败状态
     */
    hideLoadError() {
      this.setData({
        loadError: false,
        loadErrorText: '加载失败'
      })
    }
  }
})
