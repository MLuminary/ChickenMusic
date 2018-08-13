<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import ListView from 'base/listview/listview'
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  mixins: [playListMixin],
  data() {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  mounted() {
    this._getSingerList()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      // 路由跳转
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          this.singers = this._normalizeSinger(this.singers)
        }
      })
    },
    // 规范数组
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 十个热门的歌手
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
        }
        // 按 ABCD 索引归类好剩下的歌手
        if (!map[item.Findex]) {
          map[item.Findex] = {
            title: item.Findex,
            items: []
          }
        }
        map[item.Findex].items.push(
          new Singer(item.Fsinger_mid, item.Fsinger_name)
        )
      })
      // 处理 map 得到有序的列表
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 排序
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))

      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
