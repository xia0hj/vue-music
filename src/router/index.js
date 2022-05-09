import { createRouter, createWebHashHistory } from 'vue-router'

const PageRecommend = () => import('@/views/PageRecommend.vue'/* webpackChunkName: 'PageRecommend' */)
const PageSearch = () => import('@/views/PageSearch.vue'/* webpackChunkName: 'PageSearch' */)
const PageSinger = () => import('@/views/PageSinger.vue'/* webpackChunkName: 'PageSinger' */)
const PageTopList = () => import('@/views/PageTopList.vue'/* webpackChunkName: 'PageTopList' */)
const PageSingerDetail = () => import('@/views/PageSingerDetail.vue'/* webpackChunkName: 'PageSingerDetail' */)
const PageAlbum = () => import('@/views/PageAlbum.vue'/* webpackChunkName: 'PageAlbum' */)
const PageTopDetail = () => import('@/views/PageTopDetail.vue'/* webpackChunkName: 'PageTopDetail' */)

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
    component: PageSearch,
    children: [
      {
        path: ':id',
        component: PageSingerDetail
      }
    ]
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
