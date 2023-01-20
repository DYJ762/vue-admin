import request from '@/utils/request'

/**
 * 获取权限菜单信息
 * @param {*} params 
 * @returns 
 */
export function getPermission(params) {
  return request({
    url: '/permission',
    method: 'get',
    params
  })
}