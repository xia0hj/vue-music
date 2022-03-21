import { createRouter, createWebHashHistory } from 'vue-router'

import PageRecommend from '@/views/PageRecommend.vue'
import PageSearch from '@/views/PageSearch.vue'
import PageSinger from '@/views/PageSinger.vue'
import PageTopList from '@/views/PageTopList.vue'

const routes = [
  {
    path: '/recommend',
    component: PageRecommend
  },
  {
    path: '/search',
    component: PageSearch
  },
  {
    path: '/singer',
    component: PageSinger
  },
  {
    path: '/top-list',
    component: PageTopList
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
