import request from '@/request'

export function getWallpaper(tagId) {
  return request({
    url: `/wallpaper?tagId=${tagId}`,
    method: 'get',
  })
}
