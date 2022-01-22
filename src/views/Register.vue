<template>
  <div id="register" v-title data-title="注册 - For Fun">
    <video preload="auto" class="me-video-player" autoplay="autoplay" loop="loop">
          <source src="../../static/vedio/sea.mp4" type="video/mp4">
      </video>

    <div class="me-login-box me-login-box-radius">
      <p>
        <router-link to="/" class="me-login-design-color">返回首页</router-link>
      </p>
      <h1>ForFun 注册</h1>

      <el-form ref="userForm" :model="userForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input placeholder="用户名（邮箱）" v-model="userForm.userName"></el-input>
        </el-form-item>

        <el-form-item prop="nickname">
          <el-input placeholder="昵称" v-model="userForm.nickname"></el-input>
        </el-form-item>

        <el-form-item prop="passWord">
          <el-input placeholder="密码" v-model="userForm.passWord"></el-input>
        </el-form-item>

        <el-form-item prop="captcha">
          <el-input class="me-login-captcha" placeholder="验证码" v-model="userForm.captcha" type="text"></el-input>
          <el-button type="primary" :disabled="captchaDisabled" @click.native.prevent="captcha()">{{count}}</el-button>
        </el-form-item>

        <el-form-item size="small" class="me-login-button">
          <el-button type="primary" @click.native.prevent="register('userForm')">注册</el-button>
        </el-form-item>
      </el-form>

      <div class="me-login-design">
        <p>已有账号，去
          <strong>
            <router-link to="/login" class="me-login-design-color">登陆</router-link>
          </strong>
        </p>
      </div>

    </div>
  </div>
</template>

<script>
  import {register} from '@/api/login'
  import { captcha} from '@/api/login'

  export default {
    name: 'Register',
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
          nickname: '',
          passWord: '',
          uuid: '',
          captcha: ''
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {max: 10, message: '不能大于10个字符', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {max: 10, message: '不能大于10个字符', trigger: 'blur'}
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
      register(formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.$store.dispatch('register', that.userForm).then(() => {
              that.$message({message: '注册成功 快写文章吧', type: 'success', showClose: true});
              that.$router.push({path: '/'})
            }).catch((error) => {
              if (error !== 'error') {
                that.$message({message: error, type: 'error', showClose: true});
              }
            })
          } else {
            return false;
          }
        });

      },
      captcha() {
        let that = this;
        this.getCode();

        captcha(that.userForm.userName).then(data => {
          that.userForm.uuid = data.data.uuid;
          Message({
            type: 'success',
            showClose: true,
            message: "验证码已发送至您的邮箱"
          })
        }).catch(error => {
          this.captchaDisabled = false;
        })
      },
      getCode(){
        const TIME_COUNT = 60;
        if (!this.timer) {
          let temp = TIME_COUNT;
          this.count = temp + 's后重新获取';
          this.captchaDisabled = true;
          this.timer = setInterval(() => {
            if (this.captchaDisabled && temp > 0 && temp <= TIME_COUNT) {
              temp--;
              this.count =  temp + 's后重新获取';
            } else {
              this.captchaDisabled = false;
              this.count = '获取验证码'
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
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

  .me-login-captcha{
    width: 50%;
  }

</style>
