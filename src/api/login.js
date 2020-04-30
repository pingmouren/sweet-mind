/*
 * @Description:登录服务
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-20 09:36:15
 * @LastEditTime: 2020-04-30 09:09:19
 */
import { stringify } from 'qs'
// import { setHeader } from '../utils/models'
import request from '../utils/request'

/**
 * @description 获取租户列表
 */
export async function getTenantInfo() {
  return request('/platform/web/tenant/list')
}

/**
 * @description 获取公钥
 */
export async function getPublicKey() {
  return request('/uaa/public_key')
}

/**
 * @description 获取nonce与时间戳
 */
export async function getStnInfo(params) {
  return request(`/uaa/stn?${stringify(params)}`)
}

/**
 * @description 登录
 */
export async function onLogin(params) {
  return request('/platform/web/tenant/login/li', {
    method: 'POST',
    data: params
  })
}
