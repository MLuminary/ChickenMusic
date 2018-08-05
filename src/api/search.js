import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
  const url = '/api/getSearch'

  const data = Object.assign({}, commonParams, {
    w: query,
    catZhida: zhida ? 1 : 0,
    p: page,
    perpage,
    n: perpage,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      // 返回一个 Promise 对象
      return Promise.resolve(res.data)
    })
}
