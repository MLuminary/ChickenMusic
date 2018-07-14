<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getMusicSource } from 'api/song'

const TYPE_SINGER = 'singer'

export default {
  data() {
    return {
      page: 1,
      result: []
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    search() {
      // 搜索接口
      search(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(res => {
            this.result = res
          })
        }
      })
    },
    // 将歌手和歌曲存入一个数组
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        return this._normalizeSongs(data.song.list).then(res => {
          return ret.concat(res)
        })
      }
    },
    _normalizeSongs(list) {
      let ret = []
      let musicDatas = []
      // 将其中全部转换为 promise 存在数组中
      var arr = list.map(musicData => {
        if (musicData.songid && musicData.albummid) {
          musicDatas.push(musicData)
          return getMusicSource(musicData.songmid)
        }
      })
      // 收集所有回调函数的内容
      return Promise.all(arr).then(value => {
        value.forEach((item, index) => {
          if (item && musicDatas[index]) {
            const songVkey = item.data.items[0].vkey
            ret.push(createSong(musicDatas[index], songVkey))
          }
        })
        return ret
      })
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    }
  },
  watch: {
    query() {
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
    .icon
      flex 0 0 30px
      width 30px
      [class^='icon-']
        font-size 14px
        color $color-text-d
    .name
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
        no-wrap()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
