/*
 * @Description:用户模型
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-05-06 08:52:00
 * @LastEditTime: 2020-05-06 09:02:25
 */
// import { Message } from 'element-ui'

const state = {
  currentUser: {}
}

const mutations = {
  SAVE_CURRECT_USER: (state, payload) => {
    const currentUser = {
      name: sessionStorage.getItem('currentUserName'),
      avatar: `${window.location.origin}/images/user_avatar.png`
    }
    state.currentUser = { ...payload, ...currentUser }
  }
}

const actions = {
  saveCurrentUser({ commit }) {
    commit('SAVE_CURRECT_USER')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
