<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="suggest">
    <ul class="suggest-list">
      <!-- 在这里解决异步问题 result.concat(Lresult) -->
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>

  </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getMusicSource } from 'api/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  data() {
    return {
      page: 1,
      result: [],
      Lresult: [], // 避免因异步造成的数组为空清空
      pullup: true, // 需要上拉刷新
      hasMore: true // 可以加载更多
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
  components: {
    Scroll,
    Loading
  },
  methods: {
    search() {
      // query 改变时，初始化数据
      this.page = 1
      this.hasMore = true
      this.result = []
      this.$refs.suggest.scrollTo(0, 0)
      // 搜索接口
      search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
        if (res.code === ERR_OK) {
          // 将数组处理合并成最终可赋值的结果
          this._genResult(res.data)
          // 检查是否可以再次查找
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
        if (res.code === ERR_OK) {
          // 将数组处理合并成最终可赋值的结果
          this._genResult(res.data)
          // 检查是否可以再次查找
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (
        !song.list.length ||
        song.curnum + song.curpage * PERPAGE > song.totalnum
      ) {
        // 如果所有结果全部显示出来就置为 false
        this.hasMore = false
      }
    },
    // 将歌手和歌曲存入一个数组
    _genResult(data) {
      // 只在第一次加进歌手
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        this.result.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        this.Lresult = this._normalizeSongs(data.song.list)
      }
    },
    _normalizeSongs(list) {
      let ret = []
      // 将其中全部转换为 promise 存在数组中
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          getMusicSource(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const songVkey = res.data.items[0].vkey
              ret.push(createSong(musicData, songVkey))
            }
          })
        }
      })
      return ret
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
    },
    Lresult(newValue) {
      let newV = newValue[newValue.length - 1]
      if (newV) {
        this.result.push(newV)
      }
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
