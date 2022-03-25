// @ts-check

// 常量定义 --------------------------------------------------------------------

// 导入模块
const axios = require('axios')
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
        appResponse.json({
          code: CODE_OK,
          result: {
            sliders,
            albums
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
}

module.exports = registerRouter
