<template>
  <div class="search">

    <!-- 搜索输入框 -->
    <div class="search-input-wrapper">
      <SearchInput v-model="query"></SearchInput>
    </div>

    <!--  -->
    <div class="search-content" v-show="!query">

      <!-- 热门搜索推荐 -->
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            class="item"
            v-for="item in hotKeys"
            :key="item.id"
            @click="addQuery(item.key)"
          >
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>

      <!-- 搜索历史 -->
      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
        </h1>
        <base-search-list
          :searches="searchHistory"
          @selectItem="addQuery"
          @removeItem="deleteSearch"
        ></base-search-list>
      </div>
    </div>

    <div class="search-result" v-show="query">
      <Suggest
        :query="query"
        @selectSong="selectSong"
        @selectSinger="selectSinger"
      ></Suggest>
    </div>

    <!-- 歌手详情页二级路由 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" v-bind:data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from '@/components/Search/SearchInput'
import Suggest from '@/components/Search/Suggest'
import BaseSearchList from '@/components/base-search-list'
import { computed, ref } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/Search/use-search-history'

export default {
  name: 'page-search',
  components: {
    SearchInput,
    Suggest,
    BaseSearchList
  },
  setup: function () {
    const query = ref('')
    const hotKeys = ref([])
    const store = useStore()
    const selectedSinger = ref(null)
    const router = useRouter()
    const searchHistory = computed(() => store.state.searchHistory)

    const {
      saveSearch,
      deleteSearch
    } = useSearchHistory()

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })

    function addQuery (key) {
      query.value = key
    }

    function selectSong (song) {
      saveSearch(query.value) // 选择歌曲时记录搜索历史
      store.dispatch('addSong', song)
    }
    function selectSinger (singer) {
      saveSearch(query.value) // 选择歌手时记录搜索历史
      selectSinger.value = singer
      window.sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer)) // 把singer缓存起来，方便歌手详情页面刷新时使用
      router.push({
        path: `/singer/${singer.mid}`
      })
    }

    return {
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger,
      searchHistory,
      deleteSearch
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
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
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
