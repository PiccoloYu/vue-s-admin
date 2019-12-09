import { debounce } from '@/utils';

export default {
  data() {
    return {
      $_asideElm: null
    };
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener('resize', this.__resizeHandler);

    this.$_asideElm = document.getElementsByClassName('aside')[0];
    this.$_asideElm && this.$_asideElm.addEventListener('transitionend', this.$_sidebarResizeHandler); // 监听侧边栏 宽度
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler);
    this.$_asideElm && this.$_asideElm.removeEventListener('transitionend', this.$_sidebarResizeHandler);
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler();
      }
    }
  }
};

