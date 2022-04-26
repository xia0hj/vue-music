<template>
<ul class="song-list">
  <li
    v-for="(song, index) in songs"
    v-bind:key="song.id"
    class="item"
    v-on:click="selectItem(song, index)"
  >
    <div class="rank" v-if="isRank">
      <span :class="getRankClass(index)">{{ getRankText(index) }}</span>
    </div>
    <div class="content">
      <h2 class="name">{{song.name}}</h2>
      <p class="desc">{{getSongDesc(song)}}</p>
    </div>
  </li>
</ul>
</template>

<script>
export default {
  name: 'BaseSongList',
  props: {
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    isRank: Boolean
  },
  emits: ['selectItem'],
  methods: {
    getSongDesc: function (song) {
      return `${song.singer}·${song.album}`
    },
    selectItem: function (song, index) {
      this.$emit('selectItem', { song, index })
    },
    getRankText: function (index) {
      if (index > 2) {
        return index + 1
      }
    },
    getRankClass: function (index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image('first');
        }
        &.icon1 {
          @include bg-image('second');
        }
        &.icon2 {
          @include bg-image('third');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
