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
        component: () => import('@/pages/home'),
        name: 'home',
        title: '首页',
        meta: { title: 'Home', icon: 'el-icon-s-home', affix: true }
      }
    ]
  },
  {
    path: '/holle',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/components/HelloWorld'),
        name: 'holle',
        title: 'holle',
        meta: { title: 'holle', icon: 'el-icon-s-promotion', noCache: true }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    meta: {
      title: 'test',
      icon: 'el-icon-notebook-2'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'test1',
        component: () => import('@/pages/test1'),
        name: 'test1',
        title: 'test1',
        meta: { title: 'test1', icon: 'test1' }
      },
      {
        path: 'test2',
        component: () => import('@/pages/test2'),
        name: 'test2',
        title: 'test2',
        meta: { title: 'test2', icon: 'test2' }
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
