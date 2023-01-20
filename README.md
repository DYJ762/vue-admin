### 权限管理系统
vue持久化操作
安装npm install vuex-persistedstate --save



http://192.168.43.56:9528/sockjs-node/info?t=1666172998489 net::ERR_CONNECTION_TIMED_OUT
在使用vue-cli脚手架创建项目的时候，在cnpm create app命令后，项目创建成功后通过npm run serve命令运行以后，控制台报错，sockjs.js?9be2:1606 GET http://192.168.16.105:8080/sockjs-node/info?t=1574662800493 net::ERR_CONNECTION_TIMED_OUT

错误分析：
sockjs-node是一个JavaScript库，提供跨浏览器JavaScript的API，创建了一个低延迟、全双工的浏览器和web服务器之间通信通道。在项目运行以后，network会一直调用这个接口。如果没有使用，那么就一直会报这个异常。

解决办法：
1）找到/node_modules/sockjs-client/dist/sockjs.js
2）在1605行，注释掉self.xhr.send(payload);这一行，然后就可以解决了

1）找到/node_modules/sockjs-client/dist/sockjs.js文件
2）在1606行，注释掉self.xhr.send(payload);这一行，然后就可以解决了


vue动态路由渲染后第一次component正常，但是刷新后，页面会变空白
用字符串再在解析，不要像静态路由一样。否则第一次进去可以，刷新就变空白

2022/10/30
先解决路由刷新变空白，方法：本地不存储，页面刷新重新调用接口获取数据填充
退出未清除vuex中的动态路由数据，解决暂时用退出刷新location.reload()路由中定义的resetRouter()方法为生效

剪贴板功能插件
npm install --save clipboard