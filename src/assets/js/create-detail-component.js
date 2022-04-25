import MusicList from '@/components/MusicList'
import { processSongs } from '@/service/song'

/**
 * 传入props.data，通过fetch(data)获取songs
 * @param {string} name 组件名
 * @param {string} key data保存在sessionStorage的key
 * @param {function} fetch 根据data获取songs的函数
 * @returns 组件,data:{songs, isLoading}
 */
export default function createDetailComponent (name, key, fetch) {
  return {
    name: name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data () {
      return {
        songs: [],
        isLoading: true
      }
    },
    computed: {
      pic () {
        const data = this.computedData
        return data && data.pic
      },
      title () {
        const data = this.computedData
        return data && data.name
      },
      computedData: function () {
        // 如果是从歌手列表点进来详情页面，父组件会传一个singer参数
        // 如果刷新详情页面，singer参数从缓存中获取
        let returnData = null
        const propsData = this.$props.data
        if (propsData) {
          returnData = propsData
        } else {
          const cachedData = JSON.parse(window.sessionStorage.getItem(key))
          if (cachedData && cachedData.mid === this.$route.params.id) {
            returnData = cachedData
          }
        }
        return returnData
      }
    },
    async created () {
      const computedData = this.computedData
      if (!computedData) {
        // 歌手详情页的路径是/data/${mid}，当获取不到singer时需要回退到/data
        const prePath = this.$route.matched[0].path
        this.$router.push({ path: prePath })
        return
      }
      const result = await fetch(computedData)
      const songs = await processSongs(result.songs)
      // this.$data.songs = [] // 测试取不到songs的情况
      this.$data.songs = songs
      this.$data.isLoading = false
    }
  }
}
