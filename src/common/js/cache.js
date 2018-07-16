import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 插入一个值
function insertArray(arr, val, compare, maxLen) {
  // 找到这个值在数组中的位置
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 在开头插入最新搜索数据
  arr.unshift(val)
  // 当数组中的数据多余最大长度时删除最老的数据
  if (maxLen && maxLen < arr.length) {
    arr.pop()
  }
}

// 把 query 插入 storage 并把最新数组返回
export function saveSearch(query) {
  // 如果有 SEARCH_KEY 返回其中的数据，没有的话返回 []
  let searches = storage.get(SEARCH_KEY, [])

  insertArray(
    searches,
    query,
    item => {
      return item === query
    },
    SEARCH_MAX_LENGTH
  )

  storage.set(SEARCH_KEY, searches)
  return searches
}

// 获取 storage 中的搜索历史值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
