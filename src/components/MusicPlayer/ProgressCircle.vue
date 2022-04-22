<template>
  <div class="progress-circle">
    <svg
      v-bind:width="radius"
      v-bind:height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        v-bind:stroke-dasharray="dashArray"
        v-bind:stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset: function () {
      return (1 - this.$props.progress) * this.$data.dashArray
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .progress-circle {
    position: relative;
    circle {
      stroke-width: 8px;
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: $color-theme-d;
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme;
      }
    }
  }
</style>
