<template>
  <Teleport to="body">
  <!-- 将dom渲染到body下 -->
    <Transition name="list-fade">
      <div class="playlist" v-show="visiable && playList.length" @click="hideList">
        <div class="list-wrapper" @click.stop>

          <!-- 顶部，切换播放模式 -->
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
            </h1>
          </div>

          <!-- 歌曲滚动列表 -->
          <BaseScroll class="list-content" ref="scrollRef">
            <!-- 过渡效果定义在base.scss -->
            <TransitionGroup
              ref="ulRef"
              name="list"
              tag="ul"
            >
              <li v-for="song in sequenceList" :key="song.id" class="item" @click="selectItem(song)">
                <i class="current" :class="getCurrentIconClass(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIconClass(song)"/>
                </span>
                <span class="delete" @click.stop="removeSong(song)" :class="{disable:isRemoving}">
                  <i class="icon-delete"/>
                </span>
              </li>
            </TransitionGroup>
          </BaseScroll>

          <!-- 底部 -->
          <div class="list-footer" @click="hideList">
            <span>关闭</span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import BaseScroll from '@/components/BaseScroll'
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  name: 'PlayList',
  components: {
    BaseScroll
  },
  setup: function () {
    // data
    const visiable = ref(false)
    const scrollRef = ref(null)
    const ulRef = ref(null)
    const isRemoving = ref(false) // 播放列表移除歌曲动画

    // computed
    const store = useStore()
    const playList = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    const {
      modeIcon,
      modeText,
      changeMode
    } = useMode()

    const {
      getFavoriteIconClass,
      toggleFavorite
    } = useFavorite()

    watch(currentSong, async (newSong) => {
      if (!visiable.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrentSong()
    })

    function getCurrentIconClass (song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    function hideList () {
      visiable.value = false
    }

    async function showList () {
      // 修改visiable后，要等下一个tick才会把列表ul的dom渲染出来，better scroll依赖渲染好的dom
      visiable.value = true
      await nextTick()
      scrollRef.value.betterScroll.refresh()
      scrollToCurrentSong()
    }

    function scrollToCurrentSong () {
      const index = sequenceList.value.findIndex((item) => {
        return item.id === currentSong.value.id
      })
      if (index === -1) {
        return
      }
      const targetEl = ulRef.value.$el.children[index]
      scrollRef.value.betterScroll.scrollToElement(targetEl, 300)
    }

    function selectItem (song) {
      const index = sequenceList.value.findIndex((item) => {
        return item.id === song.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setIsPlaying', true)
    }

    function removeSong (song) {
      if (isRemoving.value) {
        return
      }
      isRemoving.value = true
      store.dispatch('removeSong', song)
      setTimeout(() => {
        // 在base.scss中定义了动画持续0.3s
        isRemoving.value = false
      }, 300)
    }

    return {
      visiable,
      playList,
      sequenceList,
      modeIcon,
      modeText,
      isRemoving,
      scrollRef,
      ulRef,
      changeMode,
      getFavoriteIconClass,
      getCurrentIconClass,
      toggleFavorite,
      hideList,
      showList,
      selectItem,
      removeSong
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
