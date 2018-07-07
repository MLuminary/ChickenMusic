import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'
import { Object } from 'core-js'

// 获取轮播图图片
export function getRecommend() {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 获取推荐歌单列表
export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
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

// 获取歌单详细内容
export function getSongList(disstid) {
  const url = '/api/getSongList'

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    format: 'json',
    g_tk: 1132671320,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
