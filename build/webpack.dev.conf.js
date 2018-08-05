'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const axios = require('axios')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
        }
      ]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    },
    before(app) {
      const ReqHeader = {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      }
      // 本地代理

      // 获取歌单
      app.get('/api/getDiscList', function(req, res) {
        // qq 音乐歌单 api 地址
        const url =
          'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        // 修改请求头获取数据
        axios
          .get(url, {
            headers: {
              referer: ReqHeader.referer,
              host: ReqHeader.host
            },
            params: req.query
          })
          .then(response => {
            // 获取到 qq 音乐的数据并以 json 格式返回
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })

      app.get('/api/getSongVkey', function(req, res) {
        // qq 音乐获取 vkey
        const url =
          'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

        // 修改请求头去获取数据
        axios
          .get(url, {
            headers: {
              referer: ReqHeader.referer,
              host: ReqHeader.host
            },
            params: req.query // 将发送过来的数据接收再当参数传递
          })
          .then(response => {
            // get qq 音乐 vkey
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })

      // 获取 qq 音乐歌词
      app.get('/api/lyric', function(req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        // 修改请求头
        axios
          .get(url, {
            headers: {
              referer: ReqHeader.referer,
              host: ReqHeader.host
            },
            params: req.query
          })
          .then(response => {
            var ret = response.data
            if (typeof ret === 'string') {
              var reg = /^\w+\(({[^()]+})\)$/ // 用来匹配 jsonp 字符串
              var matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
            }
            res.json(ret)
          })
          .catch(e => {
            console.log(e)
          })
      })

      // 根据歌单 id 获取歌单中歌曲
      app.get('/api/getSongList', function(req, res) {
        const url =
          'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        // 修改请求头
        axios
          .get(url, {
            headers: {
              referer: ReqHeader.referer,
              host: ReqHeader.host
            },
            params: req.query
          })
          .then(response => {
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })

      // search结果
      app.get('/api/getSearch', function(req, res) {
        // qq 音乐获取 vkey
        const url =
          'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

        // 修改请求头去获取数据
        axios
          .get(url, {
            headers: {
              referer: ReqHeader.referer,
              host: ReqHeader.host
            },
            params: req.query // 将发送过来的数据接收再当参数传递
          })
          .then(response => {
            // 获取搜索结果
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
