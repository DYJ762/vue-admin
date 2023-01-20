import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 获取管理员信息
 * @param {*} data 
 * @returns 
 */
export function getManagers(data) {
  return request({
    url: '/manager_page',
    method: 'post',
    data
  })
}

/**
 * 更改管理员状态信息
 * @param {*} data 
 * @returns 
 */
export function managerState(data) {
  return request({
    url: `/manager_state/${data.mg_id}`,
    method: 'put',
    data
  })
}
/**
 * 添加管理员信息
 * @param {*} data 
 * @returns 
 */
export function addManager(data) {
  return request({
    url: '/manager',
    method: 'post',
    data
  })
}

/**
 * 模糊查询管理员信息
 * @param {*} data 
 * @returns 
 */
export function selectManager(data) {
  return request({
    url: '/manager_search',
    method: 'post',
    data
  })
}



/**
 * 获取角色信息
 * @param {*} data 
 * @returns 
 */
export function getRole(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  })
}
/**
 * 获取用户对应的基本信息
 * @param {*} id 
 * @returns 
 */
export function getInfo(id) {
  return request({
    url: '/getInfo',
    method: 'get',
    params: id
  })
}
/**
 * 获取用户对应的权限菜单信息
 * @param {*} id 
 * @returns 
 */
export function getMenuList(id) {
  return request({
    url: '/getMenuList',
    method: 'get',
    params: id
  })
}



export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
