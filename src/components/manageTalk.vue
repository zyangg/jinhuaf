<template>
    <div class="manageTalk">
           <el-row>
      <el-col :span="5"><el-input  placeholder="请输入内容" v-model="searchArticle" clearable></el-input></el-col>
      <el-col :span="5"><el-button icon="el-icon-search" circle @click="search()"></el-button></el-col>
    </el-row>
   <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="标题" width="180"></el-table-column>
      <el-table-column prop="author" label="作者" width="180"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Delete(tableData[scope.$index]._id)">删除</el-button>
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
      this.$axios.get('/getPosts').then(res => {
        this.tableData = res.data.res
      })
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
      this.$axios.post('/delPost', {
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
<style lang="less" scoped>
.manageTalk {
  text-align: left;
}
</style>
