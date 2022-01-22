export function getToken() {
  return JSON.parse(localStorage.getItem('token'))
}

export function setToken(token) {
  return localStorage.setItem('token', JSON.stringify(token))
}

export function removeToken() {
  return localStorage.removeItem('token')
}
