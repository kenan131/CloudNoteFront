import axios from 'axios'
import {getToken,removeToken} from './utils/token.js';
import { Message } from 'element-ui';
import router from './router'
const service = axios.create({
    // baseURL: 'http://192.168.101.65:8088',//部署环境
    baseURL:'http://localhost:8088',//基地址 开发环境
    timeout:7000,
    withCredentials: true,//携带cookie
})


//添加拦截器
service.interceptors.request.use((config)=>{
    //请求前做什么(获取并设置token)
    config.headers['token'] = encodeURIComponent(getToken('token'));//将token存入请求头
    return config;
},(error)=>{
    //错误捕捉
    return Promise.reject(error)
})


//添加响应器
service.interceptors.response.use((response)=>{
    //对响应数据做处理
    let {type,message} = response.data;
    if(response.config.method === 'get'){
        return response;
    }
    if(type === 'E'){
        Message({message:message||'error',type:'warning'});
    }
    return response;
},(error)=>{
    if(error.response.status === 401){
        Message({
            message:"登录失效，请重新登录！",
            type:"error"
        });
        removeToken('token');
        router.push('login');
    }
    return Promise.reject(error)
})
export default service