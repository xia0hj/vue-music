<template>
  <div class="suggest"
    v-loading:[loadingText]="isLoading"
    v-no-result:[noResultText]="isNoResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
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
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'

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
    const isLoading = computed(() => {
      return !singer.value && !songs.value.length
    })
    const isNoResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    const noResultText = ref('抱歉，暂无搜索结果')

    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    // 第一次搜索，需要初始化
    async function searchFirst () {
      // 初始化
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.isShowSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
    }

    return {
      singer,
      songs,
      loadingText,
      isLoading,
      isNoResult,
      noResultText
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