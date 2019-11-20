const state = {
  opened: true,
  device: 'desktop'
};

const mutations = {
  TOGGLE_SIDEBAR: state => { // 判断侧边栏 状态 并设置状态
    state.opened = !state.opened;// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  CLOSE_SIDEBAR: (state) => {
    state.opened = false;
  },
  OPEN_SIDEBAR: (state) => {
    state.opened = true;
  }
};

const actions = {// Action 提交的是 mutation，而不是直接变更状态。
  toggleSideBar({ commit }) { // 切换侧边栏
    commit('TOGGLE_SIDEBAR');
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  closeSideBar({ commit }) {
    commit('CLOSE_SIDEBAR');
  },
  openSideBar({ commit }) {
    commit('OPEN_SIDEBAR');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

