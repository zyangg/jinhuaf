<template>
  <div class="container-fluid">
    <el-container>
  <el-aside width="300px">
    <el-row class="tac">
  <el-col :span="12">
    <h5>管理员操作</h5>
    <el-menu
     default-active="1"
      class="el-menu-vertical-demo">
     <el-menu-item index="1">
        <i class="el-icon-setting"></i>
        <router-link to="/publishArticle" active-class="active">文章发布</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-setting"></i>
        <router-link to="/userManage" active-class="active">人员管理</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <router-link to="/articleManage" active-class="active">文章管理</router-link>
      </el-menu-item>
    </el-menu>
  </el-col>
  </el-row>
  </el-aside>
  <el-main>
    <router-view></router-view>
  </el-main>
</el-container>
  </div>
</template>

<script>
// import $ from 'jquery'
export default {
  name: 'write',
  data () {
    return {
    }
  },
  methods: {
  },
  mounted: function () {
  },
  beforeRouteEnter (to, from, next) {
    const store = from.matched[0].instances.default.$store
    const message = from.matched[0].instances.default.$message
    const router = from.matched[0].instances.default.$router
    if (store.state.loginState && !store.state.isManager) {
      message('您不是管理员，如果需要权限，请联系管理员')
      router.push('/')
      next()
    } if (!store.state.loginState) {
      message('请先登录')
      router.push('/login')
    } else {
      next()
    }
  }
}
</script>
<style lang="less" scoped>
a {
  color: black;
}
.active {
  color: blue;
}
</style>
