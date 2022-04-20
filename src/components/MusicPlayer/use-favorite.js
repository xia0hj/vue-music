import { useStore } from 'vuex'
import { computed } from 'vue'

import { unshiftItem, removeItem } from '@/assets/js/web-storage'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite () {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxListLength = 100

  // 判断歌曲是否已收藏，返回相应的图标class
  function getFavoriteIconClass (song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 切换收藏/不收藏
  function toggleFavorite (song) {
    let newFavoriteList
    if (isFavorite(song)) {
      // 从收藏列表中移除
      newFavoriteList = removeItem(FAVORITE_KEY, (arrayItem) => {
        return arrayItem.id === song.id
      })
    } else {
      // 新增至收藏列表
      newFavoriteList = unshiftItem(FAVORITE_KEY, song, maxListLength, (arrayItem) => {
        return arrayItem.id === song.id
      })
    }
    store.commit('setFavoriteList', newFavoriteList)
  }

  // 判断歌曲是否已收藏，返回相应的图标class
  function isFavorite (song) {
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) >= 0
  }

  return {
    getFavoriteIconClass,
    toggleFavorite
  }
}
