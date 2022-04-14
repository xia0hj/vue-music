// @ts-check

// 常量定义 --------------------------------------------------------------------

// 导入模块
const axios = require('axios')
const pinyin = require('pinyin')
const getSecuritySign = require('./sign') // 获取签名方法

// OK状态码
const CODE_OK = 0

// 公共参数
const token = 5381
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
}

// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

// 函数定义 --------------------------------------------------------------------

// 获取一个随机数值
const getRandomValue = (prefix = '') => {
  // 前缀 + 随机数值(0~1)，并去掉小数的0.
  return prefix + Math.random().toString().replace('0.', '')
}

// 对 axios get 请求的封装
// 修改请求的 headers 值，合并公共请求参数
const getByAxios = (url, params) => {
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/'
    },
    // Object.assign()拷贝对象，commonParams覆盖{}，params覆盖commonParams
    params: Object.assign({}, commonParams, params)
  })
}

// 注册推荐列表接口路由
// 当前端调用/api/getRecommend时，会执行以下逻辑
const registerRecommend = (app) => {
  app.get('/api/getRecommend', (appRequest, appResponse) => {
    // 第三方服务接口 url
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    // 构造请求 data 参数
    const data = JSON.stringify({
      comm: { ct: 24 },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: { async: 1, cmd: 2 },
        module: 'playlist.HotRecommendServer'
      },
      focus: { module: 'music.musicHall.MusicHallPlatform', method: 'GetFocus', param: {} }
    })

    // 随机数值
    const randomVal = getRandomValue('recom')
    // 计算签名值
    const sign = getSecuritySign(data)

    // 发送 get 请求
    getByAxios(url, {
      sign,
      '-': randomVal,
      data
    }).then((axiosResponse) => {
      const data = axiosResponse.data
      if (data.code === CODE_OK) {
        // 处理轮播图数据
        const focusList = data.focus.data.shelf.v_niche[0].v_card
        const sliders = []
        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }
        // 最多获取 10 条数据
        const len = Math.min(focusList.length, 10)
        for (let i = 0; i < len; i++) {
          const item = focusList[i]
          const sliderItem = {}
          // 单个轮播图数据包括 id、pic、link 等字段
          sliderItem.id = item.id
          sliderItem.pic = item.cover
          if (jumpPrefixMap[item.jumptype]) {
            sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html'
          } else if (item.jumptype === 3001) {
            sliderItem.link = item.id
          }

          sliders.push(sliderItem)
        }

        // 处理推荐歌单数据
        const albumList = data.recomPlaylist.data.v_hot
        const albums = []
        for (let i = 0; i < albumList.length; i++) {
          const item = albumList[i]
          const albumItem = {}
          // 推荐歌单数据包括 id、username、title、pic 等字段
          albumItem.id = item.content_id
          albumItem.username = item.username
          albumItem.title = item.title
          albumItem.pic = item.cover

          albums.push(albumItem)
        }

        // 往前端发送一个标准格式的响应数据，包括成功错误码和数据
        // 注意这个是app的response，之前搞错写成axios的response了
        // 延迟发送数据，测试loading
        setTimeout(() => {
          appResponse.json({
            code: CODE_OK,
            result: {
              sliders,
              albums
            }
          })
        }, 1000)
      } else {
        appResponse.json(data)
      }
    })
  })
}

// 用于registerSingerList()函数中对于歌手数据的映射转换
const mapSingerListItem = (singerList) => {
  return singerList.map((item) => {
    return {
      id: item.singer_id,
      mid: item.singer_mid,
      name: item.singer_name,
      pic: item.singer_pic.replace(/\.webp$/, '.jpg').replace('150x150', '800x800')
    }
  })
}

const registerSingerList = (app) => {
  app.get('/api/getSingerList', (appRequest, appResponse) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
    const HOT_NAME = '热'

    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: { area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1 }
      }
    })

    const randomKey = getRandomValue('getUCGI')
    const sign = getSecuritySign(data)

    getByAxios(url, {
      sign,
      '-': randomKey,
      data
    }).then((axiosResponse) => {
      const data = axiosResponse.data
      if (data.code === CODE_OK) {
        // 处理歌手列表数据
        const singerList = data.singerList.data.singerlist
        // 构造歌手 Map 数据结构
        const singerMap = {
          hot: {
            title: HOT_NAME,
            list: mapSingerListItem(singerList.slice(0, 10))
          }
        }

        // 将歌手列表按拼音首字母分类
        singerList.forEach((item) => {
          // 把歌手名转成拼音
          const p = pinyin(item.singer_name)
          if (!p || !p.length) {
            return
          }
          // 获取歌手名拼音的首字母
          const key = p[0][0].slice(0, 1).toUpperCase()
          if (key) {
            if (!singerMap[key]) {
              singerMap[key] = {
                title: key,
                list: []
              }
            }
            // 每个字母下面会有多名歌手
            singerMap[key].list.push(mapSingerListItem([item])[0])
          }
        })

        // 热门歌手
        const hot = []
        // 字母歌手
        const letter = []

        // 遍历处理 singerMap，让结果有序
        for (const key in singerMap) {
          const item = singerMap[key]
          if (item.title.match(/[a-zA-Z]/)) {
            letter.push(item)
          } else if (item.title === HOT_NAME) {
            hot.push(item)
          }
        }
        // 按字母顺序排序
        letter.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        appResponse.json({
          code: CODE_OK,
          result: { singers: hot.concat(letter) }
        })
      } else {
        appResponse.json(data)
      }
    })
  })
}

const registerSingerDetail = (app) => {
  app.get('/api/getSingerDetail', (appRequest, appResponse) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerSongList: {
        method: 'GetSingerSongList',
        param: { order: 1, singerMid: appRequest.query.mid, begin: 0, num: 100 },
        module: 'musichall.song_list_server'
      }
    })

    const randomKey = getRandomValue('getSingerSong')
    const sign = getSecuritySign(data)

    getByAxios(url, {
      sign,
      '-': randomKey,
      data
    }).then((axiosResponse) => {
      const data = axiosResponse.data
      if (data.code === CODE_OK) {
        const list = data.singerSongList.data.songList
        // 歌单详情、榜单详情接口都有类似处理逻辑，固封装成函数
        const songList = handleSongList(list)

        appResponse.json({
          code: CODE_OK,
          result: {
            songs: songList
          }
        })
      } else {
        appResponse.json(data)
      }
    })
  })
}

const handleSongList = (list) => {
  const songList = []

  list.forEach((item) => {
    const info = item.songInfo || item
    if (info.pay.pay_play !== 0 || !info.interval) {
      // 过滤付费歌曲和获取不到时长的歌曲
      return
    }

    // 构造歌曲的数据结构
    const song = {
      id: info.id,
      mid: info.mid,
      name: info.name,
      singer: mergeSinger(info.singer),
      url: '', // 在另一个接口获取
      duration: info.interval,
      pic: info.album.mid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000` : fallbackPicUrl,
      album: info.album.name
    }

    songList.push(song)
  })

  return songList
}

// 合并多个歌手的姓名
const mergeSinger = (singer) => {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

// 注册后端路由
const registerRouter = (app) => {
  registerRecommend(app)
  registerSingerList(app)
  registerSingerDetail(app)
}

module.exports = registerRouter
