<template>
<ul class="song-list">
  <li
    v-for="song in songs"
    v-bind:key="song.id"
    class="item"
  >
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
    }
  },
  methods: {
    getSongDesc: function (song) {
      return `${song.singer}·${song.album}`
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
