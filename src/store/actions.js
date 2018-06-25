import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const selectPlay = function({ commit, state }, { list, index }) {
  // 调用修改 mutation 的方法
  commit(types.SET_SEQUENCE_LIST, list) // 添加到顺序加载列表中
  // 如果点击列表当中歌曲时，mode 为随机，那就将此时的 list 再随机一下
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index) // 设置正在播放歌曲的索引
  commit(types.SET_FULL_SCREEN, true) // 播放器页面全展示
  commit(types.SET_PLAYING_STATE, true) // 播放
}

export const randomPlay = function({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
