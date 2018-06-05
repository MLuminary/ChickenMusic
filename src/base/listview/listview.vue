<template>
  <scroll ref="listview" class="listview" :data="data">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avator">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <ul>
        <li class="item" v-for="(item,index) in shortcutList" :key="index" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
// import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18 // list-shortcut 中 item 的高度

export default {
  created() {
    // 因为此值并不需要设置 seter 和 geter
    this.touch = {}
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Scroll
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onShortCutTouchStart(e) {
      let anchorIndex = parseInt(getData(e.target, 'index'))
      let firstTouch = e.touches[0] // 第一个手指的位置
      this.touch.y1 = firstTouch.pageY // 获取刚触摸时的 y 坐标值
      this.touch.anchorIndex = anchorIndex // 存储最开始的索引
      this._scrollTo(anchorIndex)
    },
    onShortCutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 手指按住在 y 轴上的偏移除每个 item 高度来算出当前所在的字母
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      let anchorIndex = this.touch.anchorIndex + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index])
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-l
        font-size $font-size-medium
  .list-shortcut
    position absolute
    z-index 30
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    text-align center
    background $color-background-d
    font-family Helvetica
    .item
      padding 3px
      line-height 1
      color $color-text-l
      font-size $font-size-small
      &.current
        color $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
