import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

//数据持久化插件
import persistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  plugins: [persistedstate({
    // storage: window.localStorage,
    storage: window.sessionStorage,
    paths: ["user"] // 需要存储起来的模块
    // reducer(val) {
    //   return {
    //     // 只储存state中的token
    //     token: val.token,
    //   }
    // }
  })]
})

export default store