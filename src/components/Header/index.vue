<template>
  <header class="header">
    <i class="myicon" :class="iconclass" @click="test" />
    <el-breadcrumb separator="/" class="Breadcrumb_main">
      <el-breadcrumb-item class="test" :to="{ path: '/' }">首页</el-breadcrumb-item>
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
          <span v-else>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div class="avatar">
      <div class="avatar_img">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </div>
      <div class="avatar_text">
        <el-dropdown class="avatar_but" size="small" trigger="click" @command="logout">
          <span class="el-dropdown-link">你好，{{ name }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">
              <i class="el-icon-circle-close" />
              注销
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  components: {},
  props: {},
  data() {
    return {
      name: 'Admin',
      visible: false,
      levelList: null
    };
  },
  computed: {
    ...mapGetters(['opened']),
    iconclass() {
      return {
        'el-icon-s-fold': this.opened,
        'el-icon-s-unfold': !this.opened
      };
    },
    route() {
      return '';
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      /* if (route.path.startsWith('/redirect/')) {
        return;
      }*/
      this.getBreadcrumb();
    }
  },
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
    this.getBreadcrumb();
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
    test() {
      this.$store.dispatch('app/toggleSideBar');
    },
    getBreadcrumb() {
      const matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    async logout(command) {
      if (command === 'logout') {
        await this.$store.dispatch('users/logout');
        this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  height: 60px;
  line-height: 60px;
  flex-direction: row;
  justify-content: space-between; //元素在主轴（页面）上左右两端或者上下两端开始排列
  align-items: center; //弹性盒子元素在该行的侧轴（纵轴）上居中放置。
  .avatar {
    float: right;
    margin-right: 20px;
    display: flex;
    align-items: center;
    .avatar_img {
      display: flex;
      margin-right: 10px;
      align-items: center;
    }
    .avatar_text {
      cursor: pointer;
      & > span {
        position: relative;
        top: 10px;
        font-size: 15px;
      }
      .avatar_but {
        height: 30px;
        line-height: 30px;
        background: transparent;
        border: none;
        padding: -5px 10px;
        position: relative;
        top: 10px;
        font-size: 15px;
        & > .el-dropdown-link:hover {
          color: #409eff;
        }
      }
    }
  }

  .Breadcrumb_main {
    float: left;
    line-height: 60px;
    margin-left: 15px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }

  .myicon {
    font-size: 22px;
    cursor: pointer;
    margin: 0 15px;
    height: 100%;
    float: left;
    line-height: 60px;
    transition: all 0.28s;
  }
  .myicon:hover {
    color: #2f74ff;
  }
}

/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
