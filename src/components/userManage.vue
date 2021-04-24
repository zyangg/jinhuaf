<template>
  <div class="userManage">
    <el-row>
      <el-col :span="5"><el-input  placeholder="请输入内容" v-model="searchUser" clearable></el-input></el-col>
      <el-col :span="5"><el-button icon="el-icon-search" circle @click="search()"></el-button></el-col>
      <el-col :span="5"><el-button type="primary" icon="el-icon-plus" circle @click="addUser"></el-button></el-col>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="用户名" width="180"></el-table-column>
      <el-table-column prop="password" label="密码" width="180"></el-table-column>
      <el-table-column prop="manager" label="身份">
        <template slot-scope="scope">
          <span v-if="scope.row.manager === true">管理员</span>
          <span v-else-if="scope.row.manager === false">用户</span>
        </template>
      </el-table-column>
      <el-table-column prop="yule" label="娱乐"></el-table-column>
      <el-table-column prop="meishi" label="美食"></el-table-column>
      <el-table-column prop="shehui" label="社会"></el-table-column>
      <el-table-column prop="caijing" label="财经"></el-table-column>
      <el-table-column prop="keji" label="科技"></el-table-column>
      <el-table-column prop="shizheng" label="时政"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="Modify(scope.row.name, scope.row.password, scope.row.manager)"
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
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
    <el-dialog title="添加" :visible.sync="dialogAdd" width="50%" :before-close="handleClose">
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
    <el-dialog title="编辑" :visible.sync="dialogModify" width="50%" :before-close="handleClose">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogModify = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="dialogDelete" width="50%" :before-close="handleClose">
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
      searchUser: '',
      dialogAdd: false,
      dialogModify: false,
      dialogDelete: false,
      tableData: [],
      tableDataTemp: [],
      deleteIdenty: false,
      trans: {
        true: '管理员',
        false: '用户'
      },
      modifyForm: {
        name: '',
        password: '',
        manager: false
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
    this.$axios.get('/getAllUser').then(res => {
      this.tableData = res.data.res
      this.tableDataTemp = res.data.res
    })
  },
  methods: {
    search () {
      this.tableData = this.tableDataTemp.filter((el) => {
        return el.name.includes(this.searchUser) || el.password.includes(this.searchUser) ||
        this.trans[el.manager].includes(this.searchUser)
      })
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
              this.getAllUsers()
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
    getAllUsers () {
      this.$axios.get('/getAllUser').then(res => {
        this.tableData = res.data.res
      })
    },
    Modify (name, password, manager) {
      this.dialogModify = true
      this.modifyForm.name = name
      this.modifyForm.password = password
      this.modifyForm.manager = manager
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
          this.getAllUsers()
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
          this.getAllUsers()
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
</style>
