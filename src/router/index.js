/*
 * @Description: 
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-23 14:58:31
 * @LastEditTime: 2020-04-24 13:03:18
 */
import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: HelloWorld,
    },
  ],
});
