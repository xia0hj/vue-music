import { unshiftItem, removeItem } from '@/assets/js/web-storage'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory () {
  const maxLen = 200
  const store = useStore()

  function saveSearch (query) {
    const searches = unshiftItem(SEARCH_KEY, query, maxLen, (item) => {
      return item === query
    })
    store.commit('setSearchHistory', searches)
  }

  function deleteSearch (query) {
    const searches = removeItem(SEARCH_KEY, (item) => {
      return item === query
    })
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch
  }
}
