<template>
  <el-header class="me-area">
    <el-row class="me-header">

      <el-col :span="2"  :offset="2" class="me-header-left">
        <router-link to="/" class="me-title">
          <img src="../assets/img/logo.png"/>
        </router-link>
      </el-col>

      <el-col v-if="!simple" :span="12" :offset="0">
        <el-menu :router=true menu-trigger="click" active-text-color="#5FB878" :default-active="activeIndex"
                 mode="horizontal">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/category/all">文章分类</el-menu-item>
          <el-menu-item index="/archives">文章归档</el-menu-item>
          <!-- <el-menu-item index="/feedback">留言板</el-menu-item> -->
          <el-menu-item index="/wallpaper">精选壁纸</el-menu-item>

          <el-col :span="2" :offset="1">
            <el-menu-item index="/write"><i class="el-icon-edit"></i>写文章</el-menu-item>
          </el-col>

        </el-menu>
      </el-col>

      <template v-else>
        <slot></slot>
      </template>

      <el-col :span="4" :offset="0">
        <el-menu :router=true menu-trigger="click" mode="horizontal" active-text-color="#5FB878">

          <template v-if="!user.login">
            <el-menu-item index="/login">
              <el-button type="text">登录</el-button>
            </el-menu-item>
            <el-menu-item index="/register">
              <el-button type="text">注册</el-button>
            </el-menu-item>
          </template>

          <template v-else>
            <el-submenu index>
              <template slot="title">
                <img class="me-header-picture" :src="user.avatar"/>
              </template>

              <el-menu-item index @click="logoutAt"><i class="el-icon-back"></i>退出</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>

    </el-row>
  </el-header>
</template>

<script>

  import {removeToken} from '@/request/token'
  import {removeUser, getUser} from '@/request/user'
  import {logout} from '@/api/login'
  import {Message} from 'element-ui'

  export default {
    name: 'BaseHeader',
    props: {
      activeIndex: String,
      simple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    computed: {
      user() {
        let login = getUser() != null ? true : false
        let avatar = getUser() != null && getUser().avatar ? getUser().avatar : false

        return {
          login, avatar
        }
      }
    },
    methods: {
      logoutAt() {
        let that = this;

        Message({
          type: 'success',
          showClose: true,
          message: "退出成功",
          duration: 800,
          onClose:()=>{
            removeToken()
            removeUser()
            that.loginLoading = false;
            that.$router.push({path: '/login'})
          }
        })
        // logout().then(data => {
        //
        // }).finally(() => {
        //   Message({
        //     type: 'success',
        //     showClose: true,
        //     message: "退出成功",
        //     duration: 800,
        //     onClose:()=>{
        //       removeToken()
        //       removeUser()
        //       that.loginLoading = false;
        //       that.$router.push({path: '/login'})
        //     }
        //   })
        // })
      }
    }
  }
</script>

<style>

  .el-header {
    position: fixed;
    z-index: 1024;
    min-width: 100%;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
  }

  .me-title {
    margin-top: 10px;
    font-size: 24px;
  }

  .me-header-left {
    margin-top: 10px;
  }

  .me-title img {
    max-height: 2.4rem;
    max-width: 100%;
  }

  .me-header-picture {
    width: 36px;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 50%;
    vertical-align: middle;
    background-color: #5fb878;
  }
</style>
