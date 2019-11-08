<template>
  <aside class="aside" :class="classObj">
    <div class="logo">Admin</div>
    <el-menu router :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="!opened">
      <MenuItem v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex';
import { constantRoutes } from '../../router';
import MenuItem from './MenuItem';

export default {
  components: {
    MenuItem
  },
  props: {},
  data() {
    return {
      routes: constantRoutes
    };
  },
  computed: {
    ...mapGetters(['opened']),
    classObj() {
      return {
        closeaside: !this.opened,
        openaside: this.opened
      };
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;

      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
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
  methods: {}
};
</script>
<style lang="scss" scoped>
.aside {
  height: 100%;
  position: fixed;
  top: 0;
  transition: all 0.3s;
}

.closeaside {
  //left: -210px;
  width: 4.0625rem;
}

.openaside {
  //left: 0;
  width: 210px;
}

//修改el 菜单样式
.el-menu {
  background-color: transparent !important;
  .el-menu .el-menu--inline {
    background-color: transparent !important;
  }
  .el-menu-item.is-active {
    color: #2f74ff;
    fill: #2f74ff;
  }
}

.logo {
  height: 3.75rem;
  line-height: 3.75rem;
  text-align: center;
}
</style>
