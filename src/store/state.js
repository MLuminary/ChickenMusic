import { playMode } from 'common/js/config'
import { loadSearch } from 'common/js/cache'

const state = {
  singer: {}, // 歌手信息
  playing: false, // 是否正在播放
  fullScreen: false, // 播放器是否全屏
  playList: [], // 播放器歌曲列表
  sequenceList: [], // 非顺序播放列表
  mode: playMode.sequence, // 当前播放模式
  currentIndex: -1, // 当前播放的索引
  disc: {}, // 推荐歌单
  toplist: {}, // 歌单详情列表
  searchHistory: loadSearch() // 搜索历史数组
}

export default state
