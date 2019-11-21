<template>
  <div class="login-container">
    <div class="loginfrom" style>
      <el-form
        ref="loginForm"
        :rules="rules"
        :model="formtext.form"
        class="from_main"
        :style="{height:formtext.height +'px'}"
      >
        <div class="title-container">
          <h3 class="title">欢迎{{ formtext.buttext }}</h3>
        </div>
        <transition name="fade-transform" mode="out-in">
          <component :is="compdata" :form="formtext.form" />
        </transition>
        <el-button
          type="primary"
          :loading="loading"
          class="but"
          @click="handlesumbit"
        >{{ formtext.buttext }}</el-button>
      </el-form>
      <footer class="fromfooter">
        <a href="javascript:void(0)">
          <i :class="formtext.forgetpasicon" />
          {{ formtext.forgetpas }}
        </a>
        <a href="javascript:void(0)" @click="Register">{{ formtext.fun }}</a>
      </footer>
    </div>
  </div>
</template>

<script>
import Login from './Login';
import Register from './Register';
// import { test } from '../../api/user';
// import axios from 'axios';
export default {
  components: {
    Login,
    Register
  },
  props: {},
  data() {
    const validateName = (rule, value, callback) => {
      if (
        value.indexOf(' ') !== -1 &&
        value.replace(/(^s*)|(s*$)/g, '').length !== 0
      ) {
        callback(new Error('请输入正确格式'));
      } else {
        if (value.length < 3) {
          callback(new Error('长度在 3 个字符以上'));
        } else {
          callback();
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (value.length < 6) {
          callback(new Error('长度在 6 个字符以上'));
        } else {
          if (this.formtext.form.repeatpassword !== '') {
            this.$refs.loginForm.validateField('repeatpassword');
          }
          callback();
        }
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formtext.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      compdata: 'Login',
      loading: false,
      Rformtext: {
        buttext: '注册',
        fun: '返回登录',
        forgetpas: ' ',
        forgetpasicon: ' ',
        form: {
          username: '',
          password: '',
          code: '',
          repeatpassword: ''
        },
        height: 390
      },
      Lformtext: {
        buttext: '登录',
        fun: '注册用户',
        forgetpas: '忘记密码',
        forgetpasicon: 'el-icon-question',
        form: {
          username: 'admin',
          password: '123456',
          code: 'V9AM'
        },
        height: 330
      },
      Lrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        password: [{ validator: validatePass, trigger: 'blur' }]
      },
      Rrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
        repeatpassword: [{ validator: validatePass2, trigger: 'blur' }]
      }
    };
  },
  computed: {
    formtext() {
      return this.compdata === 'Login' ? this.Lformtext : this.Rformtext;
    },
    rules() {
      return this.compdata === 'Login' ? this.Lrules : this.Rrules;
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
    Register() {
      if (this.compdata === 'Login') {
        this.compdata = 'Register';
      } else {
        this.compdata = 'Login';
      }
    },
    handlesumbit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.compdata === 'Login') {
            this.$store
              .dispatch('users/login', this.formtext.form)
              .then(res => {
                this.$notify({
                  title: '成功',
                  message: '恭喜登录成功！',
                  type: 'success'
                });
                this.$router.push({ path: '/' });
                this.loading = false;
              })
              .catch(res => {
                this.loading = false;
                if (res.code === 401) {
                  this.$notify.error({
                    title: '错误',
                    message: '账号或密码错误!'
                  });
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '验证码错误!'
                  });
                }
              });
          } else {
            this.$store.dispatch('users/register', this.formtext.form);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" >
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: url("../../assets/loginbg.jpg");
  background-size: 100%;
  a {
    color: #696969;
    text-decoration: none;
  }
  a:hover {
    color: #409eff;
  }

  .el-form-item__content {
    height: 35px;
    line-height: 35px;
    // box-shadow: 0px 0px 15px #888888;
  }
  .fromfooter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .input_icon {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #dcdcdc;
    border-radius: 5px;
  }
  .but {
    width: calc(100% - 40px);
    margin-bottom: 10px;
    height: 35px;
    position: absolute;
    bottom: 55px;
  }
  .myform {
    margin-bottom: 22px;
  }
  .Login {
    .el-form-item:nth-child(3) {
      .el-form-item__content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .el-input {
          width: 70%;
        }
        .codeimg {
          height: 35px;
          background: #889aa4;
          border-radius: 0 5px 5px 0;
          cursor: pointer;
        }
      }
    }
  }
  .Register {
    .el-form-item:nth-child(4) {
      .el-form-item__content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .el-input {
          width: 70%;
        }
        .codeimg {
          height: 35px;
          background: #889aa4;
          border-radius: 0 5px 5px 0;
        }
      }
    }
  }

  .el-input {
    display: inline-block;
    height: 35px;
    width: 80%;
    input {
      -webkit-appearance: none;
      height: 35px;
      background: transparent;
      border: 1px;
      padding: 0 15px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #dcdcdc inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }
  .loginfrom {
    position: relative; //absolute
    width: 300px;
    max-width: 100%;
    //padding: 160px 35px 0;
    margin: 0 auto;
    /*top: 50%;
    right: 200px;
    -webkit-transform: translateY(-65%);
    transform: translateY(-65%);*/
    overflow: hidden;
    box-sizing: border-box;

    .from_main {
      background: #fff;
      padding: 20px;
      margin-bottom: 15px;
      transform: all 0.3s;
      transition: all 0.3s;
      border-radius: 010px;
    }
    .title-container {
      position: relative;
      .title {
        //font-size: 26px;
        color: #000;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>
