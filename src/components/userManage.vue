<template>
  <div class="userManage">
    <div style="margin-top: 15px;margin-bottom:15px;" class="flex">
      <div>
        <el-input placeholder="请输入内容" v-model="searchUser" clearable class="input-with-select">
          <el-button slot="append" icon="el-icon-search" circle @click="search()"></el-button>
        </el-input>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" circle @click="addUser"></el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="用户名" width="180"></el-table-column>
      <el-table-column prop="password" label="密码" width="180"></el-table-column>
      <el-table-column prop="manager" label="身份">
        <template slot-scope="scope">
          <span v-if="scope.row.manager === true">管理员</span>
          <span v-else-if="scope.row.manager === false">用户</span>
        </template>
      </el-table-column>
      <el-table-column prop="yule" label="娱乐新闻"></el-table-column>
      <el-table-column prop="meishi" label="美食新闻"></el-table-column>
      <el-table-column prop="shehui" label="社会新闻"></el-table-column>
      <el-table-column prop="caijing" label="财经新闻"></el-table-column>
      <el-table-column prop="keji" label="科技新闻"></el-table-column>
      <el-table-column prop="shizheng" label="时政新闻"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="Modify(scope.row.name,
            scope.row.password, scope.row.manager, scope.row.yule,
            scope.row.meishi, scope.row.keji, scope.row.caijing, scope.row.shizheng, scope.row.shehui)"
          >编辑</el-button>
          <el-button type="text" size="small" @click="Delete(scope.row.name, scope.row.manager)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="添加用户" :visible.sync="dialogAdd" width="40%" :before-close="handleClose">
      <el-form label-width="80px" :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-radio v-model="addForm.manager" :label="true">管理员</el-radio>
          <el-radio v-model="addForm.manager" :label="false">用户</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="dialogModify" width="40%" :before-close="handleClose">
      <el-form label-width="80px" :model="modifyForm">
        <el-form-item label="用户名">
          <el-input v-model="modifyForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="modifyForm.password"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-radio v-model="modifyForm.manager" :label="true">管理员</el-radio>
          <el-radio v-model="modifyForm.manager" :label="false">用户</el-radio>
        </el-form-item>
        <el-form-item label="娱乐新闻">
          <el-input v-model="modifyForm.yule" readonly></el-input>
        </el-form-item>
        <el-form-item label="美食新闻">
          <el-input v-model="modifyForm.meishi" readonly></el-input>
        </el-form-item>
        <el-form-item label="科技新闻">
          <el-input v-model="modifyForm.keji" readonly></el-input>
        </el-form-item>
        <el-form-item label="财经新闻">
          <el-input v-model="modifyForm.caijing" readonly></el-input>
        </el-form-item>
        <el-form-item label="时政新闻">
          <el-input v-model="modifyForm.shizheng" readonly></el-input>
        </el-form-item>
        <el-form-item label="社会新闻">
          <el-input v-model="modifyForm.shehui" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogModify = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除用户" :visible.sync="dialogDelete" width="30%" :before-close="handleClose">
      <span>确认删除用户信息吗？删除后无法修改</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelte()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var checkName = async (rule, value, callback) => {
      const res = await this.check()
      if (res === 1) {
        callback(new Error('用户名已经存在'))
      }
      if (res === 0) {
        callback()
      } else {
        callback(new Error('请先输入密码12233'))
      }
    }
    return {
      type: 0,
      currentPage: 1,
      total: 20,
      size: 5,
      searchUser: '',
      dialogAdd: false,
      dialogModify: false,
      dialogDelete: false,
      tableData: [],
      tableDataTemp: [],
      deleteIdenty: false,
      modifyForm: {
        name: '',
        password: '',
        manager: false,
        yule: 0,
        meishi: 0,
        caijing: 0,
        shizheng: 0,
        keji: 0,
        shehui: 0
      },
      addForm: {
        name: '',
        pass: '',
        manager: false
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          },
          { validator: checkName, trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      deleteName: ''
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    getUser () {
      this.$axios.post('/findUser', {
        data: {
          size: this.size,
          currentPage: this.currentPage
        }
      }).then((res) => {
        this.tableData = res.data.res.res
        this.total = res.data.res.total
        this.type = res.data.res.type
      })
    },
    findUser () {
      this.$axios.post('/findUserByValue', {
        data: {
          value: this.searchUser,
          size: this.size,
          currentPage: this.currentPage
        }
      }).then((res) => {
        this.tableData = res.data.res.res
        this.total = res.data.res.total
        this.type = res.data.res.type
      })
    },
    handleSizeChange (val) {
      this.size = val
      if (this.type === 1) {
        this.getUser()
      }
      if (this.type === 2) {
        this.findUser()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.type === 1) {
        this.getUser()
      }
      if (this.type === 2) {
        this.findUser()
      }
    },
    search () {
      if (this.searchUser === '') {
        this.getUser()
      } else {
        this.currentPage = 1
        this.findUser()
      }
    },
    async check () {
      await this.$axios
        .post('/check', {
          data: this.addForm.name
        })
        .then(res => {
          this.nameLength = res.data.res
        })
      return this.nameLength
    },
    confirmAdd () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$axios
            .post('/register', {
              data: this.addForm
            })
            .then(res => {
              this.dialogAdd = false
              this.searchUser = ''
              this.getUser()
              this.$message({
                message: '注册成功',
                type: 'success'
              })
            })
        } else {
          this.$message.error('注册失败')
        }
      })
    },
    addUser () {
      this.dialogAdd = true
      this.$refs.addForm.resetFields()
    },
    Modify (
      name,
      password,
      manager,
      yule,
      meishi,
      keji,
      caijing,
      shizheng,
      shehui
    ) {
      this.dialogModify = true
      this.modifyForm.name = name
      this.modifyForm.password = password
      this.modifyForm.manager = manager
      this.modifyForm.yule = yule
      this.modifyForm.meishi = meishi
      this.modifyForm.caijing = caijing
      this.modifyForm.shizheng = shizheng
      this.modifyForm.keji = keji
      this.modifyForm.shehui = shehui
    },
    Delete (name, ismanage) {
      this.dialogDelete = true
      this.deleteName = name
      this.deleteIdenty = ismanage
    },
    confirmDelte () {
      this.dialogDelete = false
      if (this.deleteIdenty) {
        this.$message({
          message: '不能删除管理员',
          type: 'error'
        })
        return false
      }
      this.$axios
        .post('/DeleteUser', {
          data: this.deleteName
        })
        .then(() => {
          this.getUser()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    confirmModify () {
      console.log('aaaaaa', this.modifyForm)
      this.dialogModify = false
      this.$axios
        .post('/ModifyUser', {
          data: this.modifyForm
        })
        .then(() => {
          this.getUser()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.userManage {
  text-align: left;
}
.flex {
  display: flex;
  justify-content: space-between;
}
</style>
