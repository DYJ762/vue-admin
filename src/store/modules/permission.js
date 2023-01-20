import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout' // 布局组件
import { firstUpperCase } from '@/utils' // 处理单词首字母大写的方法
import { getMenuList } from '@/api/user' // 获取菜单的方法
import { loadView } from '@/utils/index'

// roles表示登录成功传过来的用户id

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     if (route.meta.roles.indexOf(roles) > -1) {
//       return true
//     } else {
//       return false
//     }
//     // return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//   return res
// }
// 过滤获取到的菜单
export function generaMenu(routes, data) {
  let menu
  data.map(item => {
    menu = {
      path: `${item.path}`,
      // name: item.name, // 单词首字母大写
      name: firstUpperCase(item.name), // 单词首字母大写
      component: item.component === '#' ? Layout : loadView(item.component),
      children: [],
      // hidden: item.children == null ? true : false,
      redirect: `${item.redirect}`,
      meta: { title: item.title, icon: item.icon }
    }
    if (item.children) {
      menu.children = []
    }
    // console.log(menu)
    // 解决后台返回的数据 子级路由没有重定向这一属性
    if (menu.redirect === 'null') {
      delete menu.redirect
      // menu.meta.icon = 'el-icon-menu'
    }
    // if (item.children && item.children instanceof Array) {
    if (item.children && item.children.length) {
      menu.children.map(v => {
        delete v.redirect
        // delete v.hidden
      })
      generaMenu(menu.children, item.children)
    } else {
      delete menu['children']
    }

    // console.log(menu)
    routes.push(menu)
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async (resolve) => {
      const loadMenuData = []
      let menuList = []
      // 从本地缓存获取菜单
      const menuRouter = JSON.parse(localStorage.getItem('menuList'))
      // 如果没有就发送请求获取菜单
      if (!menuRouter) {
        const res = await getMenuList({ id: roles })
        menuList = res.results
        // 将菜单存入本地缓存
        localStorage.setItem('menuList', JSON.stringify(menuList))
      } else {
        // 如果本地缓存有，就直接从本地缓存获取
        menuList = menuRouter
      }
      // 复制一个对象
      Object.assign(loadMenuData, menuList)
      console.log(loadMenuData)
      // 将获取到的菜单格式化成标准的路由格式********问题：多了子类
      generaMenu(asyncRoutes, loadMenuData)

      console.log(asyncRoutes)
      let accessedRoutes
      console.log(roles)
      if (roles) {
        console.log('roles-if')
        accessedRoutes = asyncRoutes || []
      } else {
        console.log('roles-else')
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

