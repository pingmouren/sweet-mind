/*
 * @Description:登录模型
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-28 14:43:59
 * @LastEditTime: 2020-04-30 09:42:05
 */
import { Message } from 'element-ui'
import router from '@/router'
import { Base64 } from 'js-base64'
import {
  getTenantInfo,
  getPublicKey,
  getStnInfo,
  onLogin
} from '@/api/login'
import { setAuthority } from '@/utils/authority'

const gitBase64 = Base64.noConflict()
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))

const state = {
  tenants: [],
  pubKey: undefined,
  timestamp: undefined,
  nonce: undefined,
  salt: undefined,
  access_token: undefined,
  status: undefined
}

const mutations = {
  SAVE_TENANTS: (state, tenants) => {
    state.tenants = [...tenants]
  },
  SAVE_PUBKEY: (state, pubKey) => {
    state.pubKey = pubKey
  },
  SAVE_STN: (state, { timeStamp, nonce, salt }) => {
    state.timestamp = timeStamp
    state.nonce = nonce
    state.salt = salt
  },
  CHANGE_STATUS: (state, { status, type, currentAuthority }) => {
    setAuthority(currentAuthority)
    state.status = status
    state.type = type
  },
  SAVE_TOKEN: (state, payload) => {
    if (payload.errcode === '0') {
      const accessToken = payload.data.access_token
      const { changePass } = payload.data
      sessionStorage.setItem('accessToken', accessToken)
      sessionStorage.setItem('changePass', changePass)
      try {
        const strUser = gitBase64.decode(accessToken.split(/\./g)[1])
        const formatUser = strUser.substring(0, strUser.lastIndexOf('}') + 1)
        const userInfo = JSON.parse(formatUser)
        const currentUserName = userInfo.name
        const roleList = userInfo.authorities
        sessionStorage.setItem('currentUserName', currentUserName)
        sessionStorage.setItem('roleList', roleList)
      } catch (e) {
        sessionStorage.setItem('currentUserName', payload.data.name)
      }
      state.access_token = accessToken
    }
  }
}

const actions = {
  async getTenants({ commit }) {
    const response = await getTenantInfo()
    if (response && response.errcode !== '-1') {
      commit('SAVE_TENANTS', response.data)
    } else {
      Message.error('获取不到租户信息，请重试！')
    }
  },
  async getPublicKey({ commit }) {
    const response = await getPublicKey()
    if (response && response.errcode !== '-1') {
      commit('SAVE_PUBKEY', response.data)
    } else {
      Message.error('获取不到公钥，请重试！')
    }
  },
  async getStn({ dispatch, commit }, payload) {
    await dispatch('getPublicKey')
    return new Promise((resolve, reject) => {
      getStnInfo(payload).then(response => {
        if (response && response.errcode !== '-1') {
          commit('SAVE_STN', response.data)
          resolve()
        } else {
          Message.error('获取不到登陆所需信息，请重试！')
          reject()
        }
      })
    })
  },
  async login({ state, commit }, { payload }) {
    let accessToken = state.access_token
    if (!accessToken) accessToken = sessionStorage.getItem('accessToken')
    if (accessToken && accessToken !== '') {
      router.push('/')
    }
    if (!payload) {
      return
    }

    const response = await onLogin(payload)

    if (response && response.errcode === '0') {
      response.status = true
      if (payload.username === 'admin1') {
        response.currentAuthority = 'super'
      } else {
        response.currentAuthority = 'user'
      }

      // 改变登录状态
      commit('CHANGE_STATUS', response)

      // 设置AccessToken状态
      commit('SAVE_TOKEN', response)

      // 保存tenantId
      sessionStorage.setItem('tenantId', payload.tenantId)

      // 登录成功
      // reloadAuthorized();

      // 跳转到首页
      await delay(300)
      if (response.data.changePass === '1') {
        sessionStorage.setItem('cusMenu', JSON.stringify([]))
        sessionStorage.setItem('menuList', JSON.stringify([]))
        sessionStorage.setItem('menuDict', JSON.stringify([]))
        // window.location.replace('/account/settings/security');
      } else {
        // 获取用户菜单
        // yield put({
        //   type: 'fetchCusMenus',
        //   payload: { category: 'tenant' },
        // });
        // yield take('fetchCusMenus/@@end');
        // yield put({
        //   type: 'saveMenu',
        // });
        // window.location.replace('/');
      }
    } else {
      Message.error(`${response.errmsg}|${response.traceId}`)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
