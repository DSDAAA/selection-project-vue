import request from '@/utils/request'

export const findPage = (pageNum, pageSize, dto) => {
  return request({
    url: `/admin/system/sysRole/findPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: dto,
  })
}

export const add = data => {
  return request({
    url: `/admin/system/sysRole/save`,
    method: 'post',
    data,
  })
}

export const update = data => {
  return request({
    url: `/admin/system/sysRole/update`,
    method: 'put',
    data,
  })
}

export const removeById = id => {
    return request({
      url: `/admin/system/sysRole/removeById/${id}`,
      method: 'delete'
    })
  }
  
