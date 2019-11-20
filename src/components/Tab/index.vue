<template>
  <div class="Tab" :style="style">
    <el-tabs
      v-model="activeTab"
      type="card"
      closable
      @contextmenu.native="openMenu($event)"
      @tab-remove="removeTab"
      @tab-click="clickTab"
    >
      <el-tab-pane
        v-for="(item) in visitedViews"
        :key="item.name"
        :label="item.meta.title"
        :name="item.path"
      />
    </el-tabs>
    <Contextmenu
      :visible.sync="visible"
      :x="contentmenuX"
      :y="contentmenuY"
      @rowClick="contextmenuClick"
    >
      <Contextmenuitem :menulist="tagName ==='/home' ? contextmenuList :menulist" />
    </Contextmenu>
    <!--<ul
      v-show="visible"
      :style="{left:contentmenuX+'px',top:contentmenuY+'px'}"
      class="contextmenu"
      @click="rowClick"
    >
      <li v-for="(item) in menulist" :key="item.value" :data-value="item.value">{{ item.title }}</li>
    </ul>-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import path from 'path';
import Contextmenu from './contextmenu';
import Contextmenuitem from './contextmenu/contextmenuitem';
export default {
  components: {
    Contextmenu,
    Contextmenuitem
  },
  props: {},
  data() {
    return {
      affixTags: [],
      editableTabsValue: '',
      contentmenuX: 0,
      contentmenuY: 0,
      visible: false,
      tagName: '/home',
      contextmenuList: [{ icon: '', title: '关闭全部', value: 'All' }],
      menulist: [
        { icon: '', title: '刷新', value: 'Refresh' },
        { icon: '', title: '关闭其他', value: 'Other' },
        { icon: '', title: '关闭全部', value: 'All' },
        { icon: '', title: '关闭左侧', value: 'Left' },
        { icon: '', title: '关闭右侧', value: 'Right' }
      ]
    };
  },
  computed: {
    ...mapGetters(['constantRoutes', 'visitedViews', 'cachedViews', 'device']),
    routes() {
      return this.constantRoutes;
    },
    activeTab: {
      get: function() {
        // 必须有返回值，用来获取属性，称为get函数
        const route = this.$route;
        const { path } = route;
        return path;
      },
      set: function(val) {
        return val;
      }
    },
    style() {
      return {
        width: this.device === 'desktop' ? 'calc(100% - 19px) !important' : ''
      };
    }
  },
  watch: {
    $route() {
      this.addTags();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
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
    this.initTags();
    this.addTags();
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
    ...mapActions('pages', [
      'close',
      'closeLeft',
      'closeRight',
      'closeOther',
      'closeAll',
      'Refresh'
    ]),
    isActive(route) {
      return route.path === this.$route.path;
    },
    removeTab(targetName, action) {
      this.$store
        .dispatch('pages/settagName', targetName)
        .then(({ visitedViews, delViewName }) => {
          if (this.isActive(delViewName)) {
            this.toLastView(visitedViews, delViewName);
          }
        });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        this.$router.push('/');
      }
    },
    clickTab(tab) {
      const name = tab.name;
      this.$router.push({ path: name });
      // this.addTags();
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('pages/addVisitedView', tag);
        }
      }
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch('pages/addView', this.$route);
      }
      /* this.$nextTick(() => {
      });*/
      return false;
    },
    closeMenu() {
      this.visible = false;
    },
    openMenu(e) {
      let target = e.target;
      let flag = false;
      if (target.className.indexOf('el-tabs__item') > -1) flag = true;
      else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode;
        flag = true;
      }
      if (flag) {
        e.preventDefault();
        e.stopPropagation();
        this.contentmenuX = e.clientX;
        this.contentmenuY = e.clientY;
        this.tagName = target.getAttribute('aria-controls').slice(5);
        this.visible = true;
      }
    },
    contextmenuClick(command) {
      this.handleControlItemClick(command, this.tagName);
    },
    handleControlItemClick(command, tagName = null) {
      const params = {
        pageSelect: tagName
      };
      switch (command) {
        case 'Left':
          this.closeLeft(params);
          break;
        case 'Right':
          this.closeRight(params);
          break;
        case 'Other':
          this.closeOther(params);
          break;
        case 'All':
          this.closeAll();
          break;
        case 'Refresh':
          this.Refresh(params);
          break;
        case 'This':
          this.closeThis(params);
          break;
        case 'test':
          break;
        default:
          this.$message.error('无效的操作');
          break;
      }
    }
    /* Refresh(view) {
      const { pageSelect } = view;
      this.$store.dispatch('pages/settagName', pageSelect).then(() => {
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + pageSelect
          });
        });
      });
    }*/
  }
};
</script>
<style lang="scss" >
.Tab {
  // width: calc(100% - 19px);
  .el-tabs--card {
    & > .el-tabs__header {
      padding: 0;
      margin: 0;
      border-bottom: 1px solid #cfd7e5 !important;
      .el-tabs__item.is-active.is-closable {
        background: #fff;
      }
    }
    .el-tabs__item {
      background-color: rgba(0, 0, 0, 0.03);
      border-left-color: #cfd7e5 !important;
    }
    .el-tabs__item:first-child {
      &.is-closable:hover {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .el-icon-close {
        display: none;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
