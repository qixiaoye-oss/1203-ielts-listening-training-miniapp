/**
 * 音频加载进度 Behavior
 * 用于显示音频下载的圆饼进度
 *
 * 数据说明：
 * - audioLoading: 是否显示加载遮罩（语义清晰）
 * - audioDownProgress: 下载进度 0-100（用于渲染进度圆饼）
 */
module.exports = Behavior({
  data: {
    // 是否显示音频加载遮罩
    audioLoading: false,
    // 音频下载进度 (0-100)
    audioDownProgress: 0
  },

  methods: {
    /**
     * 开始音频加载
     */
    startAudioLoading() {
      this.setData({
        audioLoading: true,
        audioDownProgress: 0
      })
    },

    /**
     * 更新音频加载进度
     * @param {number} progress - 进度值 (0-100)
     */
    updateAudioProgress(progress) {
      this.setData({ audioDownProgress: progress })
    },

    /**
     * 完成音频加载
     */
    finishAudioLoading() {
      this.setData({
        audioLoading: false,
        audioDownProgress: 100
      })
    }
  }
})
