// 常量定义 --------------------------------------------------------------------

// 导入模块
const axios = require('axios')
const pinyin = require('pinyin')
const Base64 = require('js-base64').Base64
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

// 获取一个随机 uid
function getUid () {
  const t = (new Date()).getUTCMilliseconds()
  return '' + Math.round(2147483647 * Math.random()) * t % 1e10
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

const postByAxios = (url, params) => {
  return axios.post(url, params, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
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

// 注册歌曲 url 获取接口路由
// 因为歌曲的 url 每天都在变化，所以需要单独的接口根据歌曲的 mid 获取
function registerSongsUrl (app) {
  app.get('/api/getSongsUrl', (req, res) => {
    const mid = req.query.mid

    let midGroup = []
    // 第三方接口只支持最多处理 100 条数据，所以如果超过 100 条数据，我们要把数据按每组 100 条切割，发送多个请求
    if (mid.length > 100) {
      const groupLen = Math.ceil(mid.length / 100)
      for (let i = 0; i < groupLen; i++) {
        midGroup.push(mid.slice(i * 100, (100 * (i + 1))))
      }
    } else {
      midGroup = [mid]
    }

    // 以歌曲的 mid 为 key，存储歌曲 URL
    const urlMap = {}

    // 处理返回的 mid
    function process (mid) {
      const data = {
        req_0: {
          module: 'vkey.GetVkeyServer',
          method: 'CgiGetVkey',
          param: {
            guid: getUid(),
            songmid: mid,
            songtype: new Array(mid.length).fill(0),
            uin: '0',
            loginflag: 0,
            platform: '23',
            h5to: 'speed'
          }
        },
        comm: {
          g_tk: token,
          uin: '0',
          format: 'json',
          platform: 'h5'
        }
      }

      const sign = getSecuritySign(JSON.stringify(data))
      const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomValue()}&sign=${sign}`

      // 发送 post 请求
      return postByAxios(url, data).then((response) => {
        const data = response.data
        if (data.code === CODE_OK) {
          const midInfo = data.req_0.data.midurlinfo
          const sip = data.req_0.data.sip
          const domain = sip[sip.length - 1]
          midInfo.forEach((info) => {
            // 获取歌曲的真实播放 URL
            urlMap[info.songmid] = domain + info.purl
          })
        }
      })
    }

    // 构造多个 Promise 请求
    const requests = midGroup.map((mid) => {
      return process(mid)
    })

    // 并行发送多个请求
    return Promise.all(requests).then(() => {
      // 所有请求响应完毕，urlMap 也就构造完毕了
      res.json({
        code: CODE_OK,
        result: {
          map: urlMap
        }
      })
    })
  })
}

// 注册歌词接口
function registerLyric (app) {
  app.get('/api/getLyric', (appRequest, appResponse) => {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

    getByAxios(url, {
      '-': 'MusicJsonCallback_lrc',
      pcachetime: +new Date(),
      songmid: appRequest.query.mid,
      g_tk_new_20200303: token
    }).then((response) => {
      const data = response.data
      if (data.code === CODE_OK) {
        appResponse.json({
          code: CODE_OK,
          result: {
            lyric: Base64.decode(data.lyric)
          }
        })
      } else {
        appResponse.json(data)
      }
    })
  })
}

// 注册歌单专辑接口
function registerAlbum (app) {
  app.get('/api/getAlbum', (appRequest, appResponse) => {
    const data = {
      req_0: {
        module: 'srf_diss_info.DissInfoServer',
        method: 'CgiGetDiss',
        param: {
          disstid: Number(appRequest.query.id),
          onlysonglist: 1,
          song_begin: 0,
          song_num: 100
        }
      },
      comm: {
        g_tk: token,
        uin: '0',
        format: 'json',
        platform: 'h5'
      }
    }

    const sign = getSecuritySign(JSON.stringify(data))

    const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomValue()}&sign=${sign}`

    postByAxios(url, data).then((axiosResponse) => {
      const data = axiosResponse.data
      if (data.code === CODE_OK) {
        const list = data.req_0.data.songlist
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

// 注册排行榜接口
function registerTopList (app) {
  app.get('/api/getTopList', (appRequest, appResponse) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    const data = JSON.stringify({
      comm: { ct: 24 },
      toplist: { module: 'musicToplist.ToplistInfoServer', method: 'GetAll', param: {} }
    })

    const randomKey = getRandomValue('recom')
    const sign = getSecuritySign(data)

    getByAxios(url, {
      sign,
      '-': randomKey,
      data
    }).then((axiosResponse) => {
      const data = axiosResponse.data
      if (data.code === CODE_OK) {
        const topList = []
        const group = data.toplist.data.group

        group.forEach((item) => {
          item.toplist.forEach((listItem) => {
            topList.push({
              id: listItem.topId,
              pic: listItem.frontPicUrl,
              name: listItem.title,
              period: listItem.period,
              songList: listItem.song.map((songItem) => {
                return {
                  id: songItem.songId,
                  singerName: songItem.singerName,
                  songName: songItem.title
                }
              })
            })
          })
        })

        appResponse.json({
          code: CODE_OK,
          result: {
            topList
          }
        })
      } else {
        appResponse.json(data)
      }
    })
  })
}

// 注册后端路由
const registerRouter = (app) => {
  registerRecommend(app)
  registerSingerList(app)
  registerSingerDetail(app)
  registerSongsUrl(app)
  registerLyric(app)
  registerAlbum(app)
  registerTopList(app)
}

module.exports = registerRouter
