import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// // 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }


/**
 * 常用路由属性配置
 * Note: sub-menu only appear when route children.length >= 1
 *
 * name:'router-name'            设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * path: string,                 路由地址
 * component: Component,         页面组件路径
 * alwaysShow: true,             当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                               只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                               若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                               你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: 'noRedirect',       重定向路由地址，当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * hidden: true,                 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * meta : {
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'/'el-icon-x' 设置该路由的图标，支持 svg-class、element-ui icon以及awesome icon
    noCache: true                如果设置设置true，页面将不会被缓存，默认false
    affix: true                  如果设置为true，它则会固定在tags-view中(默认 false)
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'  当路由设置了该属性，则会高亮相对应的侧边栏。
                                 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
                                 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
  * isTree: false,               是否将菜单设置为el-tree树形菜单表现形式，默认false，父路由设置后子路由将全默认为树形结构，为此，子路由设置无意义
                                 用于一些特定的场景，如：菜单中，“信息管理-信息发布”下展示栏目树列表，点击栏目查看本栏目下信息列表的场景
  }
  * children: Array<RouteConfig>,  嵌套子路由
 */

/**
 * constantRoutes 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。公共的路由
 */
export const constantRoutes = [
  {
    path: '/login',
    // component: () => import('@/views/login/index'),
    component: (resolve) => require([`@/views/login/index`], resolve),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children:
      [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }]
  },
  {
    path: '/icons',
    component: Layout,
    redirect: '/icons',
    children:
      [{
        path: 'icons',
        name: 'icons',
        component: () => import('@/views/icons/index'),
        meta: { title: '图标', icon: 'dashboard', affix: true }
      }]
  }
  // , {
  //   path: '/icons',
  //   component: Layout,
  //   name: 'Icons',
  //   component: () => import('@/views/icons/index'),
  //   meta: { title: '图标', icon: 'dashboard', affix: true }
  // }
]

/**
 * 需要权限部分的路由asyncRoutes[动态路由]
 */
export const asyncRoutes = []

// 错误路由
export const errorRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()


// 重置路由：用户退出时可调用
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  console.log('重置路由：用户退出')
  console.log(router)
  const newRouter = createRouter() // 重新创建新路由
  router.matcher = newRouter.matcher // reset router //把新路由的规则赋值给旧路由
}


export default router
