import { createRouter, createWebHashHistory } from 'vue-router'

import PageRecommend from '@/views/PageRecommend.vue'
import PageSearch from '@/views/PageSearch.vue'
import PageSinger from '@/views/PageSinger.vue'
import PageTopList from '@/views/PageTopList.vue'
import PageSingerDetail from '@/views/PageSingerDetail.vue'
import PageAlbum from '@/views/PageAlbum.vue'
import PageTopDetail from '@/views/PageTopDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: PageRecommend,
    children: [
      {
        path: ':id',
        component: PageAlbum
      }
    ]
  },
  {
    path: '/search',
    component: PageSearch
  },
  {
    path: '/singer',
    component: PageSinger,
    children: [
      {
        path: ':id',
        component: PageSingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: PageTopList,
    children: [
      {
        path: ':id',
        component: PageTopDetail
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
