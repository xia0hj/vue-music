import axios from 'axios'

const CODE_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://152.136.29.38/vue-music/' : '/'

axios.defaults.baseURL = baseURL

// 封装axios的get请求
export function getByAxios (url, params) {
  return axios.get(url, { params })
    .then((response) => {
      const serverData = response.data
      if (serverData.code === CODE_OK) {
        return serverData.result
      }
    })
    .catch((exception) => {
      console.log(exception)
    })
}
