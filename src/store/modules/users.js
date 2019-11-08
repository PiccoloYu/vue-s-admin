// import router, { constantRoutes } from '@/router';
import { getToken, setToken, removeToken } from '@/utils/auth';// setToken, removeToken
import { login, logout } from '@/api/user';
// import Mock from 'mockjs';
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(
        function(res) {
          const { data } = res;
          if (res.data.code === 200) {
            commit('SET_TOKEN', data.token);
            setToken(data.token);
            resolve(data);
          } else {
            reject(data);
          }
        }
      );
    });
  },
  register({ commit }, userInfo) {
    // const { username , password } = userInfo;
    console.log(userInfo);
    return new Promise((resolve, reject) => {
      // console.log('123');
    });
  },
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '');
        removeToken();
        // dispatch('tagsView/delAllViews', null, { root: true })
        dispatch('pages/delAllViews', null, { root: true });
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
