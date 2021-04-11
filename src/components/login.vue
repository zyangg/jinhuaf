<template>
  <div class="container login">
    <div class="row justify-content-center">
      <div class="col-md-8 col-10 col-lg-6">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="70px"
          style="margin-top: 20px"
          label-position="top"
        >
          <el-form-item>
            <h3 style="min-width: 130px">登录界面</h3>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="$router.push('/register')">没有账号？去创建一个账号</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/login', {
              data: this.ruleForm
            })
            .then(res => {
              if (res.data.res === 1) {
                this.$message({
                  message: '登录成功',
                  type: 'success'
                })
                this.isManager()
                sessionStorage.setItem('name', this.ruleForm.username)
                this.$store.commit('saveLogin', sessionStorage.getItem('name'))
                this.$router.push('/')
              } else {
                this.$message.error('登录失败')
              }
            })
        } else {
          return false
        }
      })
    },
    isManager () {
      this.$axios
        .post('/isManager', {
          data: this.ruleForm.username
        })
        .then(async res => {
          await this.$store.commit('saveManager', res.data.res)
        })
    }
  }
}
</script>
<style scoped lang="less">
  /deep/ .el-form--label-top .el-form-item__label {
    display: block;
    float: left;
    text-align: left;
    padding: 0 0 10px;
}
</style>
