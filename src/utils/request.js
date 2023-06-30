import axios from 'axios';

// 创建一个axios实例
console.log(process.env.NODE_ENV);
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/wiseman-admin', // 基本路径
  withCredentials: true, // 开启跨域
  timeout: 30000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = 'Bearer ';
    return config;
  },
  (error) => {
    // 请求错误
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 二进制数据则直接返回
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      return response.data;
    }
    const res = response.data;
    if (res.code !== 0) {
      if (res.code == 110025 || res.code == 110026) {
        console.log('账号已注销，您可以取消停留在该页上，或重新登录', '未登录');
      } else {
        console.log(res.errMsg);
      }
      console.log(res);
      return Promise.reject(new Error(res.errMsg || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.log('数据请求错误,请稍后再试...');
    return Promise.reject(error);
  }
);

export default service;
