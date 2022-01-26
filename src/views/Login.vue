<template>
  <div id="login" v-title data-title="登录 - Blog">
    <div class="me-login-box me-login-box-radius">
      <p>
        <router-link to="/" class="me-login-design-color">返回首页</router-link>
      </p>
      <h1>ForFun 登录</h1>

      <el-form ref="userForm" :model="userForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input placeholder="用户名（邮箱）" v-model="userForm.userName"></el-input>
        </el-form-item>

        <el-form-item prop="passWord">
          <el-input placeholder="密码" v-model="userForm.passWord" type="password"></el-input>
        </el-form-item>

        <el-form-item size="small" class="me-login-button">
          <el-button type="primary" @click.native.prevent="login()" v-loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>

      <div class="me-login-design">
        <p>没有账号，去
          <strong>
            <router-link to="/register" class="me-login-design-color">注册</router-link>
          </strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

  import {login } from '@/api/login'
  import {setToken} from '@/request/token'
  import {setUser} from '@/request/user'
  import {Message} from "element-ui";

  export default {
    name: 'Login',
    data() {
      const checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (!value) {
          return callback(new Error('邮箱不能为空'))
        }
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      };

      return {
        captchaDisabled: false,
        count: '获取验证码',
        timer: null,
        loginLoading: false,
        userForm: {
          userName: '',
          passWord: '',
          uuid: '',
          captcha:''
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {max: 30, message: '不能大于30个字符', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          passWord: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {max: 15, message: '不能大于15个字符', trigger: 'blur'},
            {min: 6, message: '不能小于6个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {

      login() {
        let that = this;
        that.loginLoading = true;
        login(that.userForm.userName, that.userForm.passWord, that.userForm.uuid, that.userForm.captcha).then(data => {
          setToken(data.data.tokenRsp);
          setUser(data.data.userEntityRsp);
          Message({
            type: 'success',
            showClose: true,
            message: "登录成功",
            duration: 1000,
            onClose:()=>{
              that.loginLoading = false;
              that.$router.push({path: '/'})
            }
          })
        }).finally(() => {
          that.loginLoading = false;
        })
      }
    }
  }
</script>

<style scoped>
  #login {
    min-width: 100%;
    min-height: 100%;
  }

  .me-video-player {
    background-color: transparent;
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
    position: absolute;
    left: 0;
    z-index: 0;
    top: 0;
  }

  .me-login-box {
    position: absolute;
    width: 300px;
    background-color: white;
    margin-top: 150px;
    margin-left: -180px;
    left: 50%;
    padding: 30px;
  }

  .me-login-box-radius {
    border-radius: 10px;
    box-shadow: 0px 0px 1px 1px rgba(161, 159, 159, 0.1);
  }

  .me-login-box h1 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    vertical-align: middle;
  }

  .me-login-design {
    text-align: center;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
  }

  .me-login-design-color {
    color: #5FB878 !important;
  }

  .me-login-button {
    text-align: center;
  }

  .me-login-button button {
    width: 100%;
  }

</style>
