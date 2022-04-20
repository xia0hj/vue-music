import { useStore } from 'vuex'
import { computed } from 'vue'

import { unshiftItem } from '@/assets/js/web-storage'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite () {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)

  // 判断歌曲是否已收藏，返回相应的图标class
  function getFavoriteIconClass (song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 切换收藏/不收藏
  function toggleFavorite (song) {
    let newFavoriteList
    if (isFavorite(song)) {

    } else {
      newFavoriteList = unshiftItem(FAVORITE_KEY, song, (arrayItem) => {
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
    getFavoriteIconClass
  }
}
