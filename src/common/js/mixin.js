import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

// 几个组件共用的代码
export const playListMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  // keepalive
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'favoriteList'
    ]),
    iconMode() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    }
  },
  methods: {
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list) // 将此时的 sequenceList 设为 playList
    },
    // 保证切换模式的时候歌曲保持不变
    resetCurrentIndex(list) {
      // 找到当前播放歌曲的索引
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 更换此歌曲最喜爱或正常
    toggleFavorite(song) {
      if (this.isFavoriteSong(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    // 获得最喜爱或者正常的 class
    getFavoriteIcon(song) {
      if (this.isFavoriteSong(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    // 判断是否是最喜欢的歌曲
    isFavoriteSong(song) {
      let index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList'])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    // input失去焦点让键盘收回
    blurInput() {
      this.$refs.searchBox.blur()
    },
    onQueryChange(newQuery) {
      this.query = newQuery
    },
    // 点击热门关键词赋值到 searchBox
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 保存搜索结果
    saveSearch() {
      // 存储在 vuex 中和 localStorage
      this.saveSearchHistory(this.query)
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
  }
}
