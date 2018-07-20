<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hidden">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <!-- 使用 :key="index" 竟然不好使！ -->
            <li :key="item.id" ref="listItem" class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hidden">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
      <!-- <add-song ref="addSong"></add-song> -->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { playMode } from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
// import AddSong from 'components/add-song/add-song'
// import { playerMixin } from 'common/js/mixin'
import { mapMutations, mapActions } from 'vuex'
import { playerMixin } from 'common/js/mixin'

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirmClear() {
      this.deleteSongList()
    },
    show() {
      // 每次 dom 操作时都要重新计算
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        // 跳转到当前播放歌曲
        this.scrollToCurrent(this.currentSong)
      })
    },
    hidden() {
      this.showFlag = false
    },
    getCurrentIcon(item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      } else {
        return ''
      }
    },
    // 点击列表歌单
    selectItem(item, index) {
      // 如果是随机播放
      if (this.mode === playMode.random) {
        // 找到当前播放歌曲的 Id 在 playlist中的数据
        index = this.playList.findIndex(song => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent(current) {
      // 找到当前播放歌曲在 sequenceList 中的位置
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne(item) {
      this.deleteSong(item)
      // 如果已经删除完毕，就将歌单隐藏
      if (!this.playList.length) {
        this.hidden()
      }
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['deleteSong', 'deleteSongList'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  components: {
    Scroll,
    Confirm
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.playlist
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 200
  background-color $color-background-d
  &.list-fade-enter-active, &.list-fade-leave-active
    transition opacity 0.3s
    .list-wrapper
      transition all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  &.list-fade-enter, .list-wrapper
    position absolute
    left 0
    bottom 0
    width 100%
    background-color $color-highlight-background
    .list-header
      position relative
      padding 20px 30px 10px 20px
      .title
        display flex
        align-items center
        .icon
          margin-right 10px
          font-size 30px
          color $color-theme-d
        .text
          flex 1
          font-size $font-size-medium
          color $color-text-l
        .clear
          extend-click()
          .icon-clear
            font-size $font-size-medium
            color $color-text-d
    .list-content
      max-height 240px
      overflow hidden
      .item
        display flex
        align-items center
        height 40px
        padding 0 30px 0 20px
        overflow hidden
        &.list-enter-active, &.list-leave-active
          transition all 0.1s
        &.list-enter, &.list-leave-to
          height 0
        .current
          flex 0 0 20px
          width 20px
          font-size $font-size-small
          color $color-theme-d
        .text
          flex 1
          no-wrap()
          font-size $font-size-medium
          color $color-text-d
        .like
          extend-click()
          margin-right 15px
          font-size $font-size-small
          color $color-theme
          .icon-favorite
            color $color-sub-theme
        .delete
          extend-click()
          font-size $font-size-small
          color $color-theme
    .list-operate
      width 140px
      margin 20px auto 30px auto
      .add
        display flex
        align-items center
        padding 8px 16px
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        .icon-add
          margin-right 5px
          font-size $font-size-small-s
        .text
          font-size $font-size-small
    .list-close
      text-align center
      line-height 50px
      background $color-background
      font-size $font-size-medium-x
      color $color-text-l
</style>
