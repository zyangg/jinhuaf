<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 col-10 col-lg-6">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="70px"
          style="margin-top: 20px"
          label-position="top"
        >
          <el-form-item>
            <div style="margin-bottom: 20px">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="50"></el-avatar>
            </div>
            <h1 style="mix-width:130px" class="title">注册界面</h1>
          </el-form-item>
          <el-form-item label="用户名" prop="name">
            <el-input type="type" v-model="ruleForm.name" autocomplete="off" clearable>
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password clearable>
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password clearable>
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              style="width:50%;margin-top:20px"
            >注册</el-button>
          </el-form-item>
          <el-form-item>
            已有账号?
            <el-button type="text" @click="$router.push('/login')">去登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted: function () {},
  data () {
    var checkPass = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      }
      if (value === this.ruleForm.pass) {
        callback()
      } else {
        callback(new Error('请先输入密码'))
      }
    }
    var checkName = async (rule, value, callback) => {
      const res = await this.check()
      if (res === 1) {
        callback(new Error('用户名已经存在'))
      }
      if (res === 0) {
        callback()
      } else {
        callback(new Error('请先输入密码'))
      }
    }
    return {
      ruleForm: {
        name: '',
        pass: '',
        checkPass: ''
      },
      nameLength: 0,
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度3 到 10 个字符',
            trigger: 'blur'
          },
          { validator: checkName, trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度3 到 10 个字符', trigger: 'blur' }
        ],
        checkPass: [{ validator: checkPass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    async check () {
      await this.$axios
        .post('/check', {
          data: this.ruleForm.name
        })
        .then(res => {
          this.nameLength = res.data.res
        })
      return this.nameLength
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/register', {
              data: this.ruleForm
            })
            .then(res => {
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              this.resetForm()
            })
        } else {
          this.$message.error('注册失败')
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
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
.title {
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
}
/deep/.el-input--prefix .el-input__inner {
    border-radius: 20px;
}
/deep/ .el-button {
  border-radius: 20px;
}
</style>
