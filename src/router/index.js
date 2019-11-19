import Vue from 'vue';
import Router from 'vue-router';
import Layout from '../components/Layout';
import NProgress from 'nprogress';
import { getToken } from '@/utils/auth';
import 'nprogress/nprogress.css'; // progress bar style
Vue.use(Router);

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

NProgress.configure({ showSpinner: false }); // NProgress Configuration

export const constantRoutes = [
  /* {
    path: '/', // 默认进入路由
    component: () => import('@/pages/home'),
    hidden: true,
    name: 'index'
  },*/
  {
    path: '/login',
    component: () => import('@/view/Login&Register'),
    hidden: true,
    name: 'login'
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/view/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/view/home'),
        name: 'home',
        title: '首页',
        meta: { title: 'Home', icon: 'el-icon-s-home', affix: true }
      }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    meta: {
      title: '图表',
      icon: 'el-icon-s-data'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'lineChart',
        component: () => import('@/view/charts/lineChart'),
        name: 'lineChart',
        title: 'lineChart',
        meta: { title: 'lineChart', icon: 'lineChart' }
      },
      {
        path: 'minChart',
        component: () => import('@/view/charts/minChart'),
        name: 'minChart',
        title: 'minChart',
        meta: { title: 'minChart', icon: 'minChart' }
      },
      {
        path: 'pieChart',
        component: () => import('@/view/charts/pieChart'),
        name: 'pieChart',
        title: 'pieChart',
        meta: { title: 'pieChart', icon: 'pieChart' }
      }
    ]
  }
];

const whiteList = ['/login'];
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// 全局路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

export default router;
