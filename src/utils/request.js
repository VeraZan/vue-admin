import axios from 'axios';
import { Message } from 'element-ui';
import { getToKen,getUserName } from "@/utils/app";

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';//实际地址看vue.config.js proxy
const service = axios.create({
  baseURL:BASEURL,
  timeout:15000//超时时间
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers['Tokey'] = getToKen();
  config.headers['UserName'] = getUserName();
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  let data = response.data;
  if(data.resCode !== 0){
    Message.error(data.message);
    return Promise.reject(data);
  }else{
    return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default service;

//使用export default xxx; import时不用{}