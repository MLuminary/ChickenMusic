import * as types from './mutation-types'

export const selectPlay = function({ commit, state }, { list, index }) {
  // 调用修改 mutation 的方法
  commit(types.SET_SEQUENCE_LIST, list) // 添加到顺序加载列表中
  commit(types.SET_PLAYLIST, list) // 添加到播放列表中
  commit(types.SET_CURRENT_INDEX, index) // 设置正在播放歌曲的索引
  commit(types.SET_FULL_SCREEN, true) // 播放器页面全展示
  commit(types.SET_PLAYING_STATE, true) // 播放
}
