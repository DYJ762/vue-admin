const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  //权限
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  //错误日志
  errorLogs: state => state.errorLog.logs
}
export default getters
