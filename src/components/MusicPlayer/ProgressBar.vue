<template>
  <div class="progress-bar" v-on:click="onClick">
    <div class="bar-inner">
      <!-- 左侧已走过的进度 -->
      <div class="progress" v-bind:style="progressStyle" ref="progressRef"/>
      <!-- 进度条上的按钮 -->
      <div
        class="progress-btn-wrapper"
        v-on:touchstart.prevent="onTouchStart"
        v-on:touchmove.prevent="onTouchMove"
        v-on:touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn" v-bind:style="btnStyle"/>
      </div>
    </div>
  </div>
</template>

<script>

const PROGRESS_BTN_WIDTH = 16
export default {
  name: 'ProgressBar',
  props: {
    // 播放进度百分比,大小区间0~1
    curProgress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progress-changing', 'progress-change-end'],
  data: function () {
    return {
      btnOffset: 0
    }
  },
  computed: {
    progressStyle: function () {
      return `width:${this.$data.btnOffset}px`
    },
    btnStyle: function () {
      return `transform:translate3d(${this.$data.btnOffset}px,0,0)`
    }
  },
  watch: {
    curProgress: function (newProgress, oldProgress) {
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH // 整个进度条的宽度
      this.$data.btnOffset = newProgress * barWidth
    }
  },
  created: function () {
    this.touchStartRecord = {} // 记录拖动进度条的初始数据
    // 为什么不定义到data，如果是<template/>中需要监测的数据才需要放到data，放到data中变成响应式有性能浪费
  },
  methods: {
    onTouchStart: function (event) {
      const touchStartRecord = this.touchStartRecord
      touchStartRecord.startX = event.touches[0].pageX
      touchStartRecord.startProgressWidth = this.$refs.progressRef.clientWidth
    },
    onTouchMove: function (event) {
      const touchStartRecord = this.touchStartRecord
      const xDelta = event.touches[0].pageX - touchStartRecord.startX // 先计算touch move的x轴坐标变化
      const newProgressWidth = touchStartRecord.startProgressWidth + xDelta // 计算得新的已走进度条宽度
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH // 整个进度条的宽度
      const newProgress = Math.min(1, Math.max(0, newProgressWidth / barWidth)) // 将新的进度百分比限制在0到1之间
      // this.$data.btnOffset = barWidth * newProgress 不需要在这里修改curProgress，而是派发事件让父组件去修改当前组件的props
      this.$emit('progress-changing', newProgress)
    },
    onTouchEnd: function () {
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH // 整个进度条的宽度
      const curProgress = this.$refs.progressRef.clientWidth / barWidth
      this.$emit('progress-change-end', curProgress)
    },
    onClick: function (event) {
      // 点击位置的x减去进度条最左侧的x
      const rect = this.$el.getBoundingClientRect()
      const newProgressWidth = event.pageX - rect.left
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH // 整个进度条的宽度
      const newProgress = Math.min(1, Math.max(0, newProgressWidth / barWidth)) // 将新的进度百分比限制在0到1之间
      this.$emit('progress-change-end', newProgress)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
