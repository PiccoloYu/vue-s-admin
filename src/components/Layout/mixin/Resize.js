import store from '@/store';

const { body } = document;
const WIDTH = 992;

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.opened) {
        store.dispatch('app/closeSideBar');
      }
    }
  },
  beforeMount() { // 在挂载开始之前被调用：
    window.addEventListener('resize', this.$_resizeHandler);
  },
  beforeDestroy() { // 实例销毁之前调用。在这一步，实例仍然完全可用。
    window.removeEventListener('resize', this.$_resizeHandler);
  },
  mounted() {
    const isMobile = this.$_isMobile();
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile');
      store.dispatch('app/closeSideBar');
    }
  },
  methods: {
    $_isMobile() {
      const rect = body.getBoundingClientRect(); // 方法返回元素的大小及其相对于视口的位置。
      return rect.width - 1 < WIDTH;
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile();
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop');
        if (isMobile) {
          store.dispatch('app/closeSideBar');
        }
      }
    }
  }
};
