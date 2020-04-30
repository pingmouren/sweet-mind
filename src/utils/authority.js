/*
 * @Description: 认证状态存储与读取（SessionStorage）
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-29 16:03:09
 * @LastEditTime: 2020-04-29 16:03:32
 */
export function getAuthority() {
  return sessionStorage.getItem('prong-authority')
}

export function setAuthority(authority) {
  return sessionStorage.setItem('prong-authority', authority)
}
