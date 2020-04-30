/*
 * @Description:路由配置
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-23 14:58:31
 * @LastEditTime: 2020-04-29 08:31:16
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/Login')
    }
  ]
})
