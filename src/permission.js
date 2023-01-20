import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { errorRoutes } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // 加载进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  //确定用户是否已登录(获取token)
  const hasToken = getToken()
  // let isToken = true
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // vuex中是否存在用户名
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo && store.getters.permission_routes && store.getters.permission_routes.length > 0) {
        console.log('页面无刷新---有信息')
        next()
      } else {
        try {
          console.log('页面刷新---重新获取信息')
          // 获取用户信息
          const { results } = await store.dispatch('user/getInfo')
          // 获取到用户id
          let mg_id = results[0].mg_id
          let accessRoutes
          // 通过id获取用户对应的权限树
          accessRoutes = await store.dispatch('permission/generateRoutes', mg_id)
          // 拼接错误页面路由
          accessRoutes = accessRoutes.concat(errorRoutes)

          router.addRoutes(accessRoutes)

          console.log(router)

          // next({ ...to, replace: true })
          // isToken = false //将isToken赋为 false ，否则会一直循环，崩溃
          next({
            ...to, // next({ ...to })的目的,是保证路由添加完了再进入页面 (可以理解为重进一次)
            replace: true, // 设置replace为true,重进一次,不会再页面历史记录下留下记录
          })
          console.log('刷新页面--->重新获取用户权限')
          // next()
        } catch (error) {
          // 删除令牌并进入登录页面重新登录
          await store.dispatch('user/resetToken')
          // Message.error({ message: error || 'Has Error' })
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)// 否则全部重定向到登录页
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})


router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
