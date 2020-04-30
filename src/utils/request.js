/*
 * @Description:网络请求工具
 * @Details: api文档: https://www.kancloud.cn/yunye/axios/234845
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-20 09:57:45
 * @LastEditTime: 2020-04-30 09:00:02
 */
import { Notification } from 'element-ui'
import axios from 'axios'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

/**
 * @description 检测代码状态
 * @param {*} response 返回状态
 */
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  const { status, request = {}} = response
  Notification.error({
    title: `请求错误 ${status}: ${request.responseURL.substr(0, 80)}...`,
    message: errortext
  })
  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

/**
 * @description 异常处理程序
 */
const errorHandler = error => {
  const { response = {}} = error
  const errortext = codeMessage[response.status] || response.statusText
  const { status, request = {}} = response
  const hashArr = window.location.pathname.split('/')

  if (status === 401) {
    Notification.error({
      message: '未登录或登录已过期，请重新登录。'
    })
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout'
    })
    return
  }
  Notification.error({
    title: `请求错误 ${status}: ${request.responseURL}`,
    message: errortext
  })
  if (hashArr.indexOf('login') === -1) {
    // environment should not be used
    if (status === 403) {
      // router.push('/exception/403');
      return
    }
    if (status <= 504 && status >= 500) {
      // router.push('/exception/500');
      return
    }
    if (status >= 404 && status < 422) {
      // router.push('/exception/404');
    }
  }
}

/**
 * @description: 创建axios实例
 */
const request = axios.create({
  baseURL: '/prong',
  timeout: 5000
})

/**
 * @description: reponse拦截器
 */
request.interceptors.response.use(
  response => response.data,
  error => errorHandler(error)
)

/**
 * @description 导出文件
 * @param {*} url
 * @param {*} options
 */
export async function requestFile(url, options) {
  const defaultOptions = {
    credentials: 'include',
    responseType: 'formData'
  }
  const newOptions = { ...defaultOptions, ...options }
  if (newOptions.method === 'POST') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers
    }
    newOptions.body = JSON.stringify(newOptions.body)
  }
  const res = await fetch(url, newOptions)
  const contentDis = res.headers.get('Content-Disposition')
  const filename = decodeURI(contentDis.split('=')[1]) || 'file'
  checkStatus(res)

  const blob = await res.blob()

  const durl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = durl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(durl)
  setTimeout(() => {
    document.body.removeChild(a)
  }, 1000)
  return res
}

export default request
