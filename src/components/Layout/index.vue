<template>
  <div class="layout" :class="classObj">
    <Aside />
    <Content />
    <div v-show="drawer" class="drawer-bg" @click="closeAside" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Content from '../Content';
import Aside from '../Aside';
import Resize from './mixin/Resize';
export default {
  components: {
    Content,
    Aside
  },
  mixins: [Resize],
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'pageopen',
      'visitedViews',
      'cachedViews',
      'device',
      'opened'
    ]),
    classObj() {
      return {
        mobile: this.device === 'mobile'
      };
    },
    drawer() {
      return !!(this.opened && this.device === 'mobile');
    },
    routes() {
      return this.$store.state.permission.routes;
    }
  },
  watch: {},
  beforeCreate() {
    /*
     *这是一个生命周期函数，表示在实例完全创建出来之前会执行他
     *在执行beforeCreate时，data和methods中的数据还没有初始化
     */
  },
  beforeMount() {
    /*
     *这是第三个生命周期函数，
     *此时模板已经在内存中编辑完成了，但尚未把模板渲染到页面中
     *也就是在 beforeMount 执行的时候，页面中的元素还没有真正替换过来，只是之前写的模板字符串
     */
  },
  created() {
    /*
     *第二个生命周期函数
     *在created中，data和methods都已经初始化好
     *如果要调用methods中的方法或者data中的数据，最早只能在created中操作
     */
  },
  // 接下来的是运行中的两个事件
  beforeUpdate() {
    /*
     *表示 我们的界面还没有更新，但是数据已经更新了
     *也就是执行beforeUpdate时，页面中显示的数据还是旧的，此时，data中的数据已经更新了
     */
  },
  updated() {
    /*
     *执行时，页面中的数据与data中的数据已经同步了
     */
  },
  mounted() {
    /*
     *这是第四个生命周期函数，
     *表示内存中的模板已经真实的挂载带页面中去了，用户可以看到渲染好的页面
     *注意：mounted是实例创建期间的最后一个生命周期函数，当执行完mounted后，表示实例别完全创建好了
     *如果要操作元素的DOM操作，最早在mounted中操作
     */
  },
  beforeDestroy() {
    /*
     *当执行该函数时，Vue实例已经从执行阶段进入了销毁阶段，
     *但是实例上所有的data和methods、过滤器、指令都还可用，此时还没有真正的销毁
     */
    // 注意：当时用了定时器时，需要我们在该函数下手动的销毁定时器，否则会造成内存泄漏
  },
  destroyed() {
    /*
     *当执行了该函数时，组件已经完全被销毁，组件中所有的数据、方法、指令、过滤器都已经不可用了
     */
  },
  methods: {
    closeAside() {
      this.$store.dispatch('app/toggleSideBar');
    }
  }
};
</script>
<style lang="scss" scoped>
.layout {
  min-height: 100%;
  width: 100%;
  background: #ebf1f6;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
