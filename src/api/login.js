import request from '@/request'

export function register(userName, nickname, passWord, uuid, captcha) {
  const data = {
    userName,
    nickname,
    passWord,
    uuid,
    captcha
  }
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function login(userName, passWord, uuid, captcha) {
  const data = {
    userName,
    passWord,
    uuid,
    captcha
  }
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function captcha(userName) {
  return request({
    url: '/user/mail/captcha',
    method: 'post',
    data: {
      userName: userName
    }
  })
}

export function getUserInfo() {
  return request({
    url: '/user/current',
    method: 'get'
  })
}

