<template>
  <div class="articleManage">
    <div style="margin-top: 15px;margin-bottom:15px;width:30%">
      <el-input placeholder="请输入内容" v-model="searchArticle" clearable class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search()" circle></el-button>
      </el-input>
    </div>
    <div>
      <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedType" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="(item, index) in cities" :key="index" :label="item">{{trans[item]}}</el-checkbox>
        </el-checkbox-group>
    </div>
    <div>
          <el-date-picker
            v-model="datePick"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
         <div style="margin: 10px 0">
           <el-button type="primary" @click="advSearch()">搜索</el-button>
        </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="title" label="标题" width="200"></el-table-column>
      <el-table-column prop="describe" label="简介" width="300"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'shehui'">社会</span>
          <span v-else-if="scope.row.type === 'meishi'">美食</span>
          <span v-else-if="scope.row.type === 'keji'">科技</span>
          <span v-else-if="scope.row.type === 'yule'">娱乐</span>
          <span v-else-if="scope.row.type === 'shizheng'">时政</span>
          <span v-else-if="scope.row.type === 'caijing'">财经</span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="访问次数"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            class="iconfont icon-zhiding"
            circle
            @click="top(tableData[scope.$index]._id)"
            v-if="!tableData[scope.$index].top"
          ></el-button>
          <el-button
            class="iconfont icon-zhiding transform"
            circle
            @click="notop(tableData[scope.$index]._id)"
            v-if="tableData[scope.$index].top"
          ></el-button>
          <el-button
            icon="el-icon-edit"
            circle
            @click="Modify(tableData[scope.$index]._id, scope.row.title, scope.row.describe,scope.row.author, scope.row.date, scope.row.time, scope.row.count, scope.row.type)"
          ></el-button>
          <el-button icon="el-icon-delete" circle @click="Delete(tableData[scope.$index]._id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑" :visible.sync="dialogModify" width="50%" :before-close="handleClose">
      <el-form label-width="80px" :model="modifyForm">
        <el-form-item label="标题">
          <el-input v-model="modifyForm.title"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="modifyForm.describe"></el-input>
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
        <el-form-item label="类型">
          <el-select v-model="modifyForm.newType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访问次数">
          <el-input v-model="modifyForm.count"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogModify = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify()">确 定</el-button>
      </span>
    </el-dialog>
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
    <el-dialog title="删除新闻" :visible.sync="dialogDelete" width="30%" :before-close="handleClose">
      <span>确认删除该新闻吗？删除后无法还原</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelte()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
const cityOptions = ['keji', 'meishi', 'shehui', 'caijing', 'shizheng', 'yule']
export default {
  data () {
    return {
      searchArticle: '',
      isIndeterminate: true,
      checkAll: false,
      tableData: [],
      checkedType: ['meishi', 'yule'],
      total: 25,
      currentPage: 1,
      size: 5,
      tableDataTemp: [],
      datePick: '',
      dialogModify: false,
      trans: {
        'keji': '科技',
        'shehui': '社会',
        'yule': '娱乐',
        'shizheng': '时政',
        'caijing': '财经',
        'meishi': '美食'
      },
      dialogDelete: false,
      cities: cityOptions,
      modifyForm: {
        id: '',
        title: '',
        desc: '',
        author: '',
        date: '',
        time: '',
        newType: '',
        count: 0
      },
      deleteId: '',
      options: [
        {
          label: '美食',
          name: 'meishi'
        },
        {
          label: '时政',
          name: 'shizheng'
        },
        {
          label: '科技',
          name: 'keji'
        },
        {
          label: '财经',
          name: 'caijing'
        },
        {
          label: '娱乐',
          name: 'yule'
        },
        {
          label: '社会',
          name: 'shehui'
        }
      ],
      object: {
        'meishi': '美食',
        '社会': '社会',
        'shizheng': '时政',
        'yule': '娱乐',
        'caijing': '财经',
        'keji': '科技'
      },
      type: 0
    }
  },
  mounted () {
    this.findAllNewPage()
  },
  methods: {
    advSearch () {
      this.$axios.post('/searchFindNew', {
        data: {
          datePick: this.datePick,
          checkedType: this.checkedType,
          size: this.size,
          currentPage: this.currentPage
        }
      }).then((res) => {
        this.tableData = res.data.res.res
        this.total = res.data.res.total
        this.type = res.data.res.type
      })
    },
    handleCheckAllChange (val) {
      this.checkedType = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleSizeChange (val) {
      this.size = val
      if (this.type === 0) {
        this.findAllNewPage()
      }
      if (this.type === 1) {
        this.findNewByValue()
      }
      if (this.type === 2) {
        this.advSearch()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.type === 0) {
        this.findAllNewPage()
      }
      if (this.type === 1) {
        this.findNewByValue()
      }
      if (this.type === 2) {
        this.advSearch()
      }
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
    top (id) {
      this.$axios
        .post('/topArticle', {
          data: id
        })
        .then(res => {
          this.findAllNewPage()
          this.$message({
            message: '置顶成功',
            type: 'success'
          })
        })
    },
    notop (id) {
      this.$axios
        .post('/notopArticle', {
          data: id
        })
        .then(res => {
          this.findAllNewPage()
          this.$message({
            message: '取消置顶',
            type: 'success'
          })
        })
    },
    search () {
      if (this.searchArticle === '') {
        this.type = 0
        this.findAllNewPage()
      } else {
        this.currentPage = 1
        this.findNewByValue()
      }
    },
    findNewByValue () {
      var that = this
      this.$axios.post('/findNewByValue', {
        data: {
          value: that.searchArticle,
          size: that.size,
          currentPage: that.currentPage
        }
      }).then((res) => {
        that.tableData = res.data.res.res
        that.total = res.data.res.total
        that.type = res.data.res.type
      })
    },
    findAllNewPage () {
      this.$axios
        .post('/findAllNewPage', {
          data: {
            size: this.size,
            currentPage: this.currentPage
          }
        })
        .then(res => {
          this.tableData = res.data.res.res
          this.total = res.data.res.total
        })
    },
    Modify (id, title, describe, author, date, time, count, newType) {
      this.dialogModify = true
      this.modifyForm.id = id
      this.modifyForm.title = title
      this.modifyForm.describe = describe
      this.modifyForm.author = author
      this.modifyForm.date = date
      this.modifyForm.time = time
      this.modifyForm.count = count
      this.modifyForm.newType = this.object[newType]
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
          this.findAllNewPage()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
    },
    confirmDelte () {
      this.dialogDelete = false
      this.$axios
        .post('/DeleteArticle', {
          data: this.deleteId
        })
        .then(() => {
          this.findAllNewPage()
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
@import "../assets/font/iconfont.css";
.articleManage {
  text-align: left;
}
/deep/ .el-button.is-circle {
  border: 0;
}
/deep/ .el-icon-delete:before {
  font-size: 16px;
}
/deep/ .el-icon-edit:before {
  font-size: 16px;
}
/deep/ .el-icon-download:before {
  font-size: 16px;
}
.transform {
   transform:rotate(180deg);
}
/deep/ .el-date-editor .el-range-separator {
    width: 10%;
}
</style>
