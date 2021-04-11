<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="用户名" width="180"></el-table-column>
      <el-table-column prop="password" label="密码" width="180"></el-table-column>
      <el-table-column prop="manager" label="身份">
        <template slot-scope="scope">
          <span v-if="scope.row.manager === true">管理员</span>
          <span v-else-if="scope.row.manager === false">用户</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Modify(scope.row.name, scope.row.password, scope.row.manager)">编辑</el-button>
          <el-button type="text" size="small" @click="Delete(scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    return {
      dialogModify: false,
      dialogDelete: false,
      tableData: [],
      modifyForm: {
        name: '',
        password: '',
        manager: false
      },
      deleteName: ''
    }
  },
  mounted () {
    this.$axios.get('/getAllUser').then(res => {
      this.tableData = res.data.res
    })
  },
  methods: {
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
    Delete (name) {
      this.dialogDelete = true
      this.deleteName = name
    },
    confirmDelte () {
      this.dialogDelete = false
      this.$axios.post('/DeleteUser', {
        data: this.deleteName
      }).then(() => {
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
      this.$axios.post('/ModifyUser', {
        data: this.modifyForm
      }).then(() => {
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
