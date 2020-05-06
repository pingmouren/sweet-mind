/*
 * @Description:登录模型
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-28 14:43:59
 * @LastEditTime: 2020-05-06 10:30:22
 */
import { Message } from 'element-ui'
// import router from '@/router'
import { Base64 } from 'js-base64'
import {
  getTenantInfo,
  getPublicKey,
  getStnInfo,
  onLogin,
  renderMenusLoginUser
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
  status: undefined,
  menuList: [],
  menuData: [],
  menuDict: {}
}

const mutations = {
  SAVE_TENANTS: (state, tenants) => {
    state.tenants = [...tenants]
  },
  SAVE_PUBKEY: (state, pubKey) => {
    sessionStorage.setItem('pubKey', pubKey)
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
  },
  SAVE_MENU: (state, { menuList, menuData, menuDict }) => {
    state.menuList = menuList
    state.menuData = menuData
    state.menuDict = menuDict
    sessionStorage.setItem('cusMenu', JSON.stringify(menuData))
    sessionStorage.setItem('menuList', JSON.stringify(menuList))
    sessionStorage.setItem('menuDict', JSON.stringify(menuDict))
  },
  CLEAR_TOKEN: (state) => {
    state.access_token = undefined
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
  async login({ state, commit, dispatch }, { payload }) {
    let accessToken = state.access_token
    if (!accessToken) accessToken = sessionStorage.getItem('accessToken')
    if (accessToken && accessToken !== '') {
      // router.push('/')
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

      // 跳转到首页
      await delay(1300)
      if (response.data.changePass === '1') {
        sessionStorage.setItem('cusMenu', JSON.stringify([]))
        sessionStorage.setItem('menuList', JSON.stringify([]))
        sessionStorage.setItem('menuDict', JSON.stringify([]))
        // window.location.replace('/account/settings/security');
      } else {
        // 获取用户菜单
        await dispatch({
          type: 'fetchCusMenus',
          payload: { category: 'tenant' }
        })
        window.location.replace('/')
      }
    } else {
      Message.error(`${response.errmsg}|${response.traceId}`)
    }
  },
  async fetchCusMenus({ dispatch, commit }, { payload, callback }) {
    const response = await renderMenusLoginUser(payload)
    if (response.errcode === '0') {
      const menuList = []
      const menuData = []
      const menuDict = {}
      if (response.data.length > 0) {
        (function deal(menus) {
          const subMenus = []
          menus.forEach(item => {
            const menu = {}
            const redirectMenu = {}
            if (item.parentId === '0') {
              redirectMenu.key = item.id
              redirectMenu.name = item.nodeName
              redirectMenu.path = item.route ? item.route : 'undefined'
              menuDict[item.route || '/undefined'] = item.id
            } else {
              menu.icon = item.logo || 'icon-todo'
            }
            menu.name = item.nodeName
            menu.path = item.route
              ? item.route.substring(item.route.lastIndexOf('/') + 1)
              : 'undefined'
            if (item.children && item.children.length > 0) {
              menu.children = deal(item.children)
              if (item.parentId === '0') {
                redirectMenu.children = [
                  {
                    path: item.children[0].route
                  }
                ]
                menuList.push(menu)
                menuData.push(redirectMenu)
              } else {
                subMenus.push(menu)
              }
            } else if (item.parentId === '0') {
              menuList.push(menu)
              menuData.push(redirectMenu)
            } else {
              subMenus.push(menu)
            }
          })
          return subMenus
        })(response.data)
      }
      await commit('SAVE_MENU', { menuList, menuData, menuDict })
      if (callback) {
        callback(menuList, menuData)
      }
    } else {
      Message.error(`${response.errmsg}|${response.traceId}`)
      dispatch('logout')
    }
  },
  logout({ commit }) {
    commit('CHANGE_STATUS', {
      status: false,
      currentAuthority: 'guest'
    })
    commit('CLEAR_TOKEN')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
