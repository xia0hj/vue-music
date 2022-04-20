<template>
  <div class="progress-bar">
    <div class="bar-inner">
      <!-- 左侧已走过的进度 -->
      <div class="progress" v-bind:style="progressStyle"/>
      <!-- 进度条上的按钮 -->
      <div class="progress-btn-wrapper">
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
    progress: {
      type: Number,
      default: 0
    }
  },
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
    progress: function (newProgress, oldProgress) {
      const barWidth = this.$el.clientHeight - PROGRESS_BTN_WIDTH // 整个进度条的宽度
      this.$data.btnOffset = newProgress * barWidth
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
