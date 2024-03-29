<template>
  <div class="recommend" v-loading:[loadingText]="isLoading">
    <BaseScroll class="recommend-content">
      <!-- better-scroll对第一个子div生效，所以用这个div包裹页面内容 -->
      <div>

        <!-- recommend页面的轮播图 -->
        <div class="slider-wrapper">
          <div class="slider-content">
            <BaseSlider :sliders="sliders" v-if="sliders.length"/>
          </div>
        </div>

        <!-- recommend页面的歌单列表 -->
        <div class="recommend-list">
          <h1 class="list-title" v-show="!isLoading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              v-bind:key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic"/>
              </div>
              <div class="text">
                <h2 class="name">{{item.username}}</h2>
                <p class="title">{{item.title}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </BaseScroll>

    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" v-bind:data="selectedAlbum"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend.js'
import BaseSlider from '@/components/BaseSlider'
import BaseScroll from '@/components/WrappedScroll'
import { ALBUM_KEY } from '@/assets/js/constant'

export default {
  name: 'PageRecommend',
  components: {
    BaseSlider,
    BaseScroll
  },
  data: function () {
    return {
      sliders: [], // 轮播图，item={id,pic,link}
      albums: [], // 推荐歌单列表，item={id,pic,username,title}
      loadingText: '正在载入...',
      selectedAlbum: null
    }
  },
  computed: {
    isLoading: function () {
      // 当data中的sliders和albums数组均不存在时认为正在加载
      return !this.$data.sliders.length && !this.$data.albums.length
    }
  },
  created: async function () {
    const result = await getRecommend()
    // 赋值给data
    this.$data.sliders = result.sliders
    this.$data.albums = result.albums
  },
  methods: {
    selectItem: function (album) {
      this.$data.selectedAlbum = album
      window.sessionStorage.setItem(ALBUM_KEY, JSON.stringify(album)) // 把album缓存起来，方便歌单详情页面刷新时使用
      this.$router.push({
        path: `/recommend/${album.id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
