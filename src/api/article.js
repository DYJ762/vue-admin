import request from '@/utils/request'


/**
 * 获取文章信息
 * @param {*} data 
 * @returns 
 */
export function getArticle(data) {
  return request({
    url: '/article_page',
    method: 'post',
    data
  })
}

/**
 * 获取文章分类信息
 * @returns 
 */
export function getCategory() {
  return request({
    url: '/category',
    method: 'get',
  })
}

/**
 * 获取文章分类信息(获取一级和二级分类的数据)
 * @param {*} params 
 * @returns 
 */
export function getCategory_parent(params) {
  return request({
    url: '/category_parent',
    method: 'get',
    params
  })
}

/**
 * 添加文章分类
 * @param {*} data 
 * @returns 
 */
export function addCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

/**
 * 删除某一个文章分类
 * @param {*} id 
 * @returns 
 */
export function delCategory(id) {
  return request({
    // url: `/category/` + id,
    url: `/category/${id}`,
    method: 'delete',
  })
}