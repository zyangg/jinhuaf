<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="author" label="作者" width="180"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="count" label="访问次数"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Modify(tableData[scope.$index]._id, scope.row.title, scope.row.author, scope.row.date, scope.row.time)">编辑</el-button>
          <el-button type="text" size="small" @click="Delete(tableData[scope.$index]._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      <el-dialog title="编辑" :visible.sync="dialogModify" width="50%" :before-close="handleClose">
      <el-form label-width="80px" :model="modifyForm">
        <el-form-item label="标题">
          <el-input v-model="modifyForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="modifyForm.author"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-input v-model="modifyForm.date"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="modifyForm.time"></el-input>
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
      tableData: [],
      dialogModify: false,
      dialogDelete: false,
      modifyForm: {
        id: '',
        title: '',
        author: '',
        date: '',
        time: ''
      },
      deleteId: ''
    }
  },
  mounted () {
    this.getAllNews()
  },
  methods: {
    getAllNews () {
      this.$axios.get('/getNews').then(res => {
        this.tableData = res.data.res
      })
    },
    Modify (id, title, author, date, time) {
      this.dialogModify = true
      this.modifyForm.id = id
      this.modifyForm.title = title
      this.modifyForm.author = author
      this.modifyForm.date = date
      this.modifyForm.time = time
    },
    Delete (id) {
      this.deleteId = id
      this.dialogDelete = true
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    confirmModify () {
      this.dialogModify = false
      this.$axios.post('/ModifyArticle', {
        data: this.modifyForm
      }).then(() => {
        this.getAllNews()
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    confirmDelte () {
      this.dialogDelete = false
      this.$axios.post('/DeleteArticle', {
        data: this.deleteId
      }).then(() => {
        this.getAllNews()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
