/*
 * @Description:模型公用方法
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-28 15:03:36
 * @LastEditTime: 2020-04-28 15:04:24
 */

/**
 * @name Token请求头
 * @description 接口请求headers
 */
export function setHeader() {
  const accessToken = sessionStorage.getItem('accessToken')
  return {
    Authorization: `Bearer ${accessToken}`
  }
}
