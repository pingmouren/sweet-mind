/*
 * @Description:路由配置
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-23 14:58:31
 * @LastEditTime: 2020-05-06 10:00:55
 */
import Vue from 'vue'
import Router from 'vue-router'
import system from './system'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/user',
      component: () => import('@/layouts/LoginLayout'),
      redirect: '/user/login',
      children: [
        {
          path: 'login',
          component: () => import('@/views/Login')
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/layouts'),
      children: [
        system
      ]
    }
  ]
})
