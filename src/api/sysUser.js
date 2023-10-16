import request from '@/utils/request'

const api_name = '/admin/system/sysUser';

export const findPage = (pageNum, pageSize, dto) => {
  return request({
    url: `${api_name}/findPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: dto,
  })
}

export const add = data => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data,
  })
}

export const update = data => {
  return request({
    url: `${api_name}/update`,
    method: 'put',
    data,
  })
}

export const removeById = id => {
    return request({
      url: `${api_name}/removeById/${id}`,
      method: 'delete'
    })
  }
  
