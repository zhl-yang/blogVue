import request from '@/request'

export function getLeaveCommentsByArticle(page) {
  return request({
    url: `/leave-comments/list`,
    method: 'post',
    data: {
      current: page.pageNo,
      size: page.pageSize
    }
  })
}

export function publishLeaveComment(comment) {
  return request({
    url: '/leave-comments/create/change',
    method: 'post',
    data: {
      content: comment
    }
  })
}

