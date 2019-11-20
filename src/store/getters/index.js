const getters = { // vuex 的计算属性可以在 这里 对值进行计算
  opened: state => {
    return state.app.opened;
  },
  device: state => {
    return state.app.device;
  },
  pageopen: state => {
    return state.pages.pageopen;
  },
  visitedViews: state => {
    return state.pages.visitedViews;
  },
  cachedViews: state => {
    return state.pages.cachedViews;
  },
  constantRoutes: state => {
    return state.pages.constantRoutes;
  },
  delViewName: state => {
    return state.pages.delViewName;
  }
};

export default getters;
