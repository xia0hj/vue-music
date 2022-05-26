<template>
  <div
    class="root"
    ref="rootRef"
    @mouseenter="stopAutoPlay()"
    @mouseleave="startAutoPlay()"
    @touchstart.stop="onTouchStart"
    @touchmove.prevent.stop="onTouchMove"
    @touchend.stop="onTouchEnd"
  >

    <div class="image-group" ref="imageGroupRef" v-bind:style="imgGroupStyle">
      <a
        class="image-wrapper"
        v-for="img in images"
        :key="img.id"
        :href='img.link'
      >
        <img v-bind:src="img.pic"/>
      </a>
    </div>

    <button class="btn btn-left" @click="clickLeft()">&lt;</button>
    <button class="btn btn-right" @click="clickRight()">&gt;</button>

    <ul class="dots" ref="dotsRef">
      <li
        class="dot"
        v-for="(img, imgIdx) in images"
        :key="img.id"
        @click="clickDot(imgIdx)"
        :class="{active: curIndex===imgIdx}"
      ></li>
    </ul>

  </div>
</template>

<script>
const TRANSITION_CLASS = 'with-transition'
export default {
  name: 'simple-carousel',
  props: {
    images: {
      type: Array,
      default () {
        return []
      }
    },
    autoPlayInterval: {
      type: Number,
      default () {
        return -1
      }
    }
  },
  data () {
    return {
      curIndex: 0,
      imgWidth: 0,
      autoPlayId: 0,
      shouldBtnWait: false
    }
  },
  computed: {
    imgGroupStyle () {
      return `left: ${-1 * this.$data.curIndex * this.imgWidth}px;` +
        ' ' +
        `width:${(this.images.length + 1) * 100}%;`
    }
  },
  mounted () {
    this.imgWidth = this.$refs.rootRef.clientWidth

    this.touchRecord = {}

    const imageGroupRef = this.$refs.imageGroupRef
    const firstImgClone = imageGroupRef.children[0].cloneNode(true)
    imageGroupRef.append(firstImgClone)

    this.startAutoPlay()
  },
  methods: {
    clickDot (index) {
      this.goToIndex(index, true)
    },
    clickRight () {
      if (this.$data.shouldBtnWait) return
      else this.lockBtn()

      const newIdx = this.$data.curIndex + 1

      // 修改下标前先加上过渡样式
      this.goToIndex(newIdx, true)

      // 偷偷从最后的假图切换成第一张图
      if (newIdx === this.images.length) {
        setTimeout(() => {
          this.goToIndex(0, false)
        }, 500)
      }
    },
    clickLeft () {
      if (this.$data.shouldBtnWait) return
      else this.lockBtn()

      const newIdx = this.$data.curIndex - 1

      if (newIdx <= -1) {
        this.goToIndex(this.images.length, false)
        setTimeout(() => {
          this.goToIndex(this.images.length - 1, true)
        }, 0)
      } else {
        this.goToIndex(newIdx, true)
      }
    },
    goToIndex (targetIndex, isWithTransition) {
      const imageGroupRef = this.$refs.imageGroupRef
      if (!imageGroupRef) return
      if (isWithTransition) {
        if (!imageGroupRef.classList.contains(TRANSITION_CLASS)) {
          imageGroupRef.classList.add(TRANSITION_CLASS)
        }
      } else {
        imageGroupRef.classList.remove(TRANSITION_CLASS)
      }
      this.$data.curIndex = targetIndex
    },
    startAutoPlay () {
      if (this.$props.autoPlayInterval >= 0) {
        clearInterval(this.$data.autoPlayId)
        this.$data.autoPlayId = setInterval(() => {
          this.clickRight()
        }, this.$props.autoPlayInterval)
      }
    },
    stopAutoPlay () {
      if (this.$props.autoPlayInterval >= 0) {
        clearInterval(this.$data.autoPlayId)
      }
    },
    lockBtn () {
      this.$data.shouldBtnWait = true
      setTimeout(() => {
        this.$data.shouldBtnWait = false
      }, 500)
    },
    onTouchStart (event) {
      this.stopAutoPlay()
      this.touchRecord.startX = event.touches[0].pageX
    },
    onTouchMove (event) {
      this.touchRecord.endX = event.touches[0].pageX
    },
    onTouchEnd () {
      const xDiff = this.touchRecord.endX - this.touchRecord.startX
      if (Math.abs(xDiff) > this.$data.imgWidth * 0.4) {
        xDiff > 0 ? this.clickLeft() : this.clickRight()
      }
      this.startAutoPlay()
    }
  }
}
</script>

<style lang="scss" scoped>
.root {
  // 除了 overflow 外都是组件外自定义的样式
  // width: 100%;
  // height: 320px;
  // border: solid 3px;
  // display: block;
  // position: relative;
  overflow: hidden;
  background-color: gray;
  .image-group {
    display: flex;
    height: 100%;
    // width: 1000%; mounted 后根据图片数量设置 n * 100% 的宽度
    position: relative;

    &.with-transition {
      transition: 0.5s ease;
    }
    .image-wrapper {
      // flex 布局让单元素居中
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .btn {
    // 设为块元素才能指定宽高
    display: block;
    width: 40px;
    height: 70px;

    /* 相对于 outer 来定位，先让按钮框的顶部贴着垂直方向的中间，然后自身上移 50% 使得按钮中线与 outer 中线重合 */
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);

    background-color: rgba(0, 0, 0, 0.7);
    font-size: 30px;
    text-align: center;
    line-height: 70px;
    text-decoration: none;
    color: white;
    cursor: pointer;
    &.btn-left {
      left: 0;
    }
    &.btn-right {
      right: 0;
    }
  }
  .dots {
    display: flex;

    /* 相对于 outer 来定位，离底部 20px */
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);

    height: 20px;
    z-index: 8;

    list-style: none;
    .dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      margin: 0 5px;
      &.active {
        background-color: lightcoral;
      }
    }
  }
}

</style>
