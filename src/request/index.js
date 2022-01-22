import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken, removeToken} from '@/request/token'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 180000
})

//request拦截器
service.interceptors.request.use(config => {
  let token = getToken()
  if (token) {
    config.headers['auth-token'] = token.token
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    //全局统一处理 Session超时
    if (response.headers['session_time_out'] == 'timeout') {
      store.dispatch('fedLogOut')
    }

    const res = response.data;
    //20 为成功状态 500为系统异常
    if (res.status !== 200 && res.status  !== 500){
      //90001 Session超时
      if (res.status === 90001) {
        return Promise.reject('error');
      }

      //401 用户未登录
      else if (res.status === 401) {
        console.info("用户未登录")
        Message({
          type: 'warning',
          showClose: true,
          message: '未登录或登录超时，请重新登录哦'
        })

        // store.dispatch('fedLogOut')

        return Promise.reject('error');
      }

      //70001 权限认证错误
      else if (res.status === 70001) {
        console.info("权限认证错误")
        Message({
          type: 'warning',
          showClose: true,
          message: '你没有权限访问哦'
        })
        return Promise.reject('error');
      } else {
        Message({
          type: 'warning',
          showClose: true,
          message: res.message
        })

      }
      removeToke
      return Promise.reject(res.message);

    } else {
      return response.data;
    }
  },
  error => {
    Message({
      type: 'warning',
      showClose: true,
      message: '连接超时'
    })
    return Promise.reject('error')
  })

export default service
