import { constantRoutes } from '@/router';
import router from '@/router';
const state = {
  constantRoutes,
  visitedViews: [], // 访问页面
  cachedViews: [], // 缓存页面
  delViewName: '',
  current: ''// 当前页面
};

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.fullPath === view.path)) return;
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    );
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return;
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name);
    }
  },
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name);
    index > -1 && state.cachedViews.splice(index, 1);
  },
  SET_DELNAME: (state, view) => {
    state.delViewName = view;
  },
  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix);
    state.visitedViews = affixTags;
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = [];
  }
};

const actions = {// Action 提交的是 mutation，而不是直接变更状态。
  settagName({ dispatch, commit }, name) {
    let view = '';
    for (let i = 0; i < state.visitedViews.length; i++) {
      if (state.visitedViews[i].path === name) {
        view = state.visitedViews[i];
      }
    }
    commit('SET_DELNAME', view);
    return new Promise(resolve => {
      dispatch('delVisitedView', view);
      dispatch('delCachedView', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
        delViewName: state.delViewName
      });
    });
  },
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view);
    dispatch('addCachedView', view);
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view);
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view);
  },
  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view);
      dispatch('delCachedView', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view);
      resolve([...state.visitedViews]);
    });
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view);
      resolve([...state.cachedViews]);
    });
  },
  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view);
      dispatch('delAllCachedViews', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS');
      resolve([...state.visitedViews]);
    });
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS');
      resolve([...state.cachedViews]);
    });
  },
  closeLeft({ state, commit, dispatch }, { pageSelect } = {}) {
    return new Promise(async resolve => {
      const pageAim = pageSelect || state.current;
      let currentIndex = 0;
      state.visitedViews.forEach((page, index) => {
        if (page.fullPath === pageAim) {
          currentIndex = index;
        }
      });
      if (currentIndex > 0) {
        // 删除打开的页面 并在缓存设置中删除
        state.visitedViews.splice(1, currentIndex - 1);// .forEach(({ name }) => commit('keepAliveRemove', name))
      }
      state.current = pageAim;
      if (router.app.$route.fullPath !== pageAim) {
        router.push(pageAim);
      }

      // end
      resolve();
    });
  },
  closeRight({ state, commit, dispatch }, { pageSelect } = {}) {
    return new Promise(async resolve => {
      const pageAim = pageSelect || state.current;
      let currentIndex = 0;
      state.visitedViews.forEach((page, index) => {
        if (page.fullPath === pageAim) {
          currentIndex = index;
        }
      });
      // 删除打开的页面 并在缓存设置中删除
      state.visitedViews.splice(currentIndex + 1);// .forEach(({ name }) => commit('keepAliveRemove', name))
      // 设置当前的页面
      state.current = pageAim;
      if (router.app.$route.fullPath !== pageAim) {
        router.push(pageAim);
      }
      // 持久化
      // await dispatch('opened2db');
      // end
      resolve();
    });
  },
  closeOther({ state, commit, dispatch }, { pageSelect } = {}) {
    return new Promise(async resolve => {
      const pageAim = pageSelect || state.current;
      let currentIndex = 0;
      state.visitedViews.forEach((page, index) => {
        if (page.fullPath === pageAim) {
          currentIndex = index;
        }
      });

      if (currentIndex === 0) {
        // 删除打开的页面 并在缓存设置中删除
        state.visitedViews.splice(1);// .forEach(({ name }) => commit('keepAliveRemove', name))
      } else {
        state.visitedViews.splice(currentIndex + 1);
        state.visitedViews.splice(1, currentIndex - 1);
      }

      // 设置当前的页面
      state.current = pageAim;
      if (router.app.$route.fullPath !== pageAim) {
        router.push(pageAim);
      }
      // 持久化
      // await dispatch('opened2db');
      // end
      resolve();
    });
  },
  closeAll({ state, commit, dispatch }) {
    return new Promise(async resolve => {
      // 删除打开的页面 并在缓存设置中删除
      state.visitedViews.splice(1);// .forEach(({ name }) => commit('keepAliveRemove', name))
      // 关闭所有的标签页后需要判断一次现在是不是在首页
      if (router.app.$route.name !== '首页') {
        router.push({
          name: '首页'
        });
      }
      resolve();
    });
  },
  Refresh({ state, commit, dispatch }, { pageSelect } = {}) {
    let view = '';
    for (let i = 0; i < state.visitedViews.length; i++) {
      if (state.visitedViews[i].path === pageSelect) {
        view = state.visitedViews[i];
      }
    }
    const { fullPath } = view;
    if (fullPath !== '/home') {
      // dispatch('delVisitedView', view);
      dispatch('delCachedView', view);
      setTimeout(() => {
        router.app.$router.replace({
          path: '/redirect' + fullPath
        });
      }, 100);
    }
  },
  closeThis() {
    console.log('closeThis');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

