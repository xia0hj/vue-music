<template>
  <div class="suggest"
    v-loading:[loadingText]="isLoading"
    v-no-result:[noResultText]="isNoResult"
    ref="scrollWrapperRef"
  >
    <ul class="suggest-list">
      <li class="suggest-item"
        v-if="singer"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>

      <li class="suggest-item"
        v-for="song in songs"
        :key="song.id"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}  -  {{ song.name }}</p>
        </div>
      </li>

      <div class="suggest-item"
        v-loading:[loadingText]="isPullUpLoading2"
      >

      </div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    isShowSinger: {
      type: Boolean,
      default: true
    }
  },
  setup: function (props) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const isAutoLoading = ref(false) // 是否正在自动补够一页的数据
    const isLoading = computed(() => {
      return !singer.value && !songs.value.length
    })
    const isNoResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    const noResultText = ref('抱歉，暂无搜索结果')

    const preventPullUpLoad = computed(() => {
      return isLoading.value || isAutoLoading.value
    })

    const {
      scrollWrapperRef,
      isPullUpLoading,
      betterScroll
    } = usePullUpLoad(searchMore, preventPullUpLoad)

    const isPullUpLoading2 = computed(() => {
      return isPullUpLoading.value && hasMore.value
    })

    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    // 第一次搜索，需要初始化
    async function searchFirst () {
      if (!props.query) {
        return
      }
      // 初始化
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.isShowSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeScrollable()
    }

    // 注意searchMore期间query改为，导致search一直取不到数据，重复发送请求
    async function searchMore () {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.isShowSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await makeScrollable()
    }

    // 针对第一页的数据没有占满一页的情况
    async function makeScrollable () {
      if (betterScroll.value.maxScrollY >= -1) {
        isAutoLoading.value = true
        await searchMore()
        isAutoLoading.value = false
      }
    }

    return {
      singer,
      songs,
      loadingText,
      isLoading,
      isNoResult,
      noResultText,
      // pull up load
      scrollWrapperRef,
      isPullUpLoading2
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
