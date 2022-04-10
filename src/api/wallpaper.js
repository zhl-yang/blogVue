import request from '@/request'

export function getWallpaper(classId, resolution) {
  const data = {
    classId,
    resolution
  }
  return request({
    url: `/wallpaper`,
    method: 'post',
    data
  })
}

export function getTags() {
  return request({
    url: `/wallpaper/getTag`,
    method: 'get',
  })
}