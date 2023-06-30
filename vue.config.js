const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      // 当我们的本地的请求有/api的时候，就会代理我们的请求地址向另外一个服务器发出请求
      '/api': {
        // target: 'http://192.168.4.173:18181', // 跨域请求的地址，这里不用写api
        // target: 'https://opss.iiec.net.cn/wiseman-admin', // 跨域请求的地址，这里不用写api
        target: 'http://192.168.4.36:18181', // limei
        ws: true, //如果要代理 websockets，配置这个参数
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 只有这个值为true的情况下才表示开启跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
});
