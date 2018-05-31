<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}">
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 300
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    // 初始化轮播图宽度
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0 // 轮播图容器宽度
      let sliderWidth = this.$refs.slider.clientWidth // 轮播图 item 宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i] // 获取每个轮播图 item
        addClass(child, 'slider-item') // 为轮播图 item 添加 class

        child.style.width = sliderWidth + 'px' // 每个轮播图 item 宽度
        width += sliderWidth // 轮播图容器总宽度
      }
      // 循环轮播需要前后各再添加一张图
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      // 设置轮播图容器宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false
      })

      // 滚动结束更新 dot 节点
      this.slider.on('scrollEnd', () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX

        if (this.autoPlay) {
          this._play()
        }
      })
      // 在滑动前清除掉上一个定时器
      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    // 跳转到下一页
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next(this.speed)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.slider
  min-height 1px
  .slider-group
    position relative
    overflow hidden
    white-space nowrap
    .slider-item
      float left
      box-sizing border-box
      overflow hidden
      text-align center
      a
        display block
        width 100%
        overflow hidden
        text-decoration none
      img
        display block
        width 100%
  .dots
    position absolute
    right 0
    left 0
    bottom 12px
    text-align center
    font-size 0
    .dot
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background $color-text-l
      &.active
        width 20px
        border-radius 5px
        background $color-text-ll
</style>
