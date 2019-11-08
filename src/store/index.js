import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import pages from './modules/pages';
import users from './modules/users';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    pages,
    users
  },
  getters
});

export default store;
