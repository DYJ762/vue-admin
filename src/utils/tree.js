/*
 * @Description: jishupu-admin-template
 * @Author: 技术铺<jishupu@qq.com>
 * @Date: 2021-12-15
 */

/**
 * 树结构数据转扁平化
 * 子集字段：children
 */
export function treeToFlat(arr) {
  return [].concat(...arr.map(item => {
    if (item.children && item.children.length > 0) {
      return [].concat(item, ...treeToFlat(item.children))
    }
    return item
  }))
}

/**
 * 扁平数据转树结构
 */
export function flatToTree(data, id, parent_id, children) {
  if (data.length === 0) return []
  id = id ?? 'id'
  parent_id = parent_id ?? 'parent_id'
  children = children ?? 'children'
  const resetData = {}
  for (var i = 0; i < data.length; i++) {
    resetData[data[i][id]] = data[i]
  }
  const tree = []
  for (var key in resetData) {
    const cur_parent_id = resetData[key][parent_id]
    if (cur_parent_id > 0) {
      if (!resetData[cur_parent_id][children]) resetData[cur_parent_id][children] = []
      resetData[cur_parent_id][children].push(resetData[key])
    } else {
      tree.push(resetData[key])
    }
  }
  return tree
}