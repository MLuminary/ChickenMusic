<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script tpye="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getMusicSource } from 'api/song'

export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.toplist.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
    },
    ...mapGetters(['toplist'])
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.toplist.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.toplist.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []

      list.forEach(item => {
        let musicData = item.data
        if (musicData.songid && musicData.albumid) {
          getMusicSource(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const songVkey = res.data.items[0].vkey
              ret.push(createSong(musicData, songVkey))
            }
          })
        }
      })

      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.3s ease
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
