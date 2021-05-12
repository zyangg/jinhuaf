<template>
  <div class="manageTalk">
    <div style="margin-top: 15px;margin-bottom:15px;width:40%">
      <el-input placeholder="请输入内容" v-model="searchArticle" clearable class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="标题" width="200"></el-table-column>
      <el-table-column prop="desc" label="描述" width="300"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="like" label="点赞数"></el-table-column>
      <el-table-column prop="reply" label="评论数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-delete" circle @click="Delete(tableData[scope.$index]._id)"></el-button>
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
    <el-dialog title="删除帖子" :visible.sync="dialogDelete" width="30%" :before-close="handleClose">
      <span>确认删除该帖子吗？删除后还原</span>
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
      searchArticle: '',
      tableData: [],
      tableDataTemp: [],
      total: 25,
      currentPage: 1,
      size: 5,
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
    handleSizeChange (val) {
      this.size = val
      this.getAllNews()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getAllNews()
    },
    search () {
      if (this.searchArticle === '') {
        this.getAllNews()
      } else {
        this.size = 5
        this.currentPage = 1
        this.searchFindPost()
      }
    },
    searchFindPost () {
      this.$axios.post('/findPost', {
        data: {
          size: this.size,
          currentPage: this.currentPage,
          value: this.searchArticle
        }
      }).then((res) => {
        this.tableData = res.data.res.res
        this.total = res.data.res.total
      })
    },
    getAllNews () {
      this.$axios.post('/getPosts', {
        data: {
          size: this.size,
          currentPage: this.currentPage
        }
      }).then(res => {
        this.tableData = res.data.res.res
        this.total = res.data.res.total
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
      this.$axios
        .post('/ModifyArticle', {
          data: this.modifyForm
        })
        .then(() => {
          this.getAllNews()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
    },
    confirmDelte () {
      this.dialogDelete = false
      this.$axios
        .post('/delPost', {
          data: this.deleteId
        })
        .then(() => {
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
/deep/ .el-button.is-circle {
  border: 0;
}
/deep/ .el-icon-delete:before {
  font-size: 18px;
}
</style>
