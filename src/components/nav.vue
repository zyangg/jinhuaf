<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="iconSpan" @click="$router.push({path: '/index'})"><i class="iconfont icon-xinwen"></i></div>
      <span class="navbar-brand cursorNone"><span>金华求新</span></span>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" exact>新闻首页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/talk" class="nav-link" active-class="active">新闻论坛</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/publishArticle" class="nav-link" active-class="active">网站管理</router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/userSetting"
              class="nav-link"
              active-class="active"
              v-show="$store.state.loginState"
            >新闻推送</router-link>
          </li>
        </ul>
        <div class="form-inline my-2 my-lg-0 mar20">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="search"
          />
          <button class="btn btn-primary my-2 my-sm-0" @click="searchFind()">Search</button>
        </div>
        <ul class="navbar-nav">
          <li class="nav-item" v-show="!$store.state.loginState">
            <router-link to="/login" class="nav-link" active-class="active">登录</router-link>
          </li>
          <li class="nav-item mar30" v-show="!$store.state.loginState">
            <router-link to="/register" class="nav-link" active-class="active">注册</router-link>
          </li>
          <li class="nav-item dropdown mar30 me flex" v-show="$store.state.loginState">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <a
              class="nav-link dropdown-toggle me"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >{{$store.state.loginState}}</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#" @click="logout()">退出</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'Nav',
  data () {
    return {
      flag: false,
      search: ''
    }
  },
  mounted () {
    this.flag = sessionStorage.getItem('name')
    if (sessionStorage.getItem('name')) {
      this.isManager(sessionStorage.getItem('name'))
    }
    this.$store.commit('saveLogin', this.flag)
    var a = document.querySelector('.navbar-toggler')
    $('.navbar-nav li a:not(.me)').on('click', function () {
      if (window.innerWidth < 992) {
        a.click()
      }
    })
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$store.commit('saveLogin', sessionStorage.getItem('name'))
      this.$store.commit('saveManager', false)
      this.$message({
        message: '退出成功',
        type: 'success'
      })
    },
    isManager (name) {
      this.$axios
        .post('/isManager', {
          data: name
        })
        .then(async res => {
          await this.$store.commit('saveManager', res.data.res)
        })
    },
    searchFind () {
      this.$router.push({ path: '/searchFind', query: { value: this.search } })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/font/iconfont.css";
.navbar-light .navbar-nav .nav-link.active {
  color: black;
}
.navbar-nav .nav-link {
  text-align: left;
  padding-left: 3px;
}
.mar30 {
  margin-right: 100px;
}
.mar20 {
  margin-right: 20px;
}
.cursorNone {
  cursor: default;
}
.flex {
  display: flex;
  align-items: center;
}
.iconSpan {
  display: inline-block;
  width: 50px;
  height: 40px;
  line-height: 40px;
}
.iconfont {
  font-size: 40px;
}
</style>
