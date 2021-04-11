import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginState: '',
    isManager: false,
    postData: [],
    newsData: []
  },
  mutations: {
    saveLogin (state, loginState) {
      state.loginState = loginState
    },
    saveManager (state, isManager) {
      state.isManager = isManager
    },
    savePost (state, postData) {
      state.postData = postData
    },
    saveNew (state, newsData) {
      state.newsData = newsData
    }
  }
})
