import Vue from 'vue';
import App from './App.vue';
import './style/index.scss';
import store from '@/store';
import router from '@/router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../mock/user';
import axios from 'axios'; // 注意这行

Vue.prototype.$http = axios; // 注意这行
Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.prototype.validForbid = function(value, number = 255) {
  value = value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, '');
  if (value.length >= number) {
    this.$message({
      type: 'warning',
      message: `输入内容不能超过${number}个字符`
    });
  }
  return value;
};

Vue.prototype.validSpace = function(value, number = 255) {
  value = value.replace(/\s/g, '');
  if (value.length >= number) {
    this.$message({
      type: 'warning',
      message: `输入内容不能超过${number}个字符`
    });
  }
  return value;
};

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
