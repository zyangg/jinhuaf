<template>
  <div class="container searchFind">
    <div class="row justify-content-start">
      <div class="col-10 mar10">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedType" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="(item, index) in cities" :key="index" :label="item">{{trans[item]}}</el-checkbox>
        </el-checkbox-group>
        <div class="block">
          <span class="demonstration">时间范围</span>
          <el-date-picker
            v-model="datePick"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeTime"
          ></el-date-picker>
        </div>
        <div class="mar10">
           <el-button type="primary" @click="advSearch()">搜索</el-button>
        </div>
      </div>
      <div class="col-md-4 col-12 col-xl-3 col-sm-6"
       v-for="(item, index) in tempData" :key="index">
        <el-card :body-style="{ padding: '0px' }" style="margin-top:15px">
          <img
            :src="item.img[0]"
            class="image"
            width="100%"
            height="200px"       />
          <div style="padding: 14px;">
            <div class="newTitle">{{item.title}}</div>
            <div class="bottom clearfix">
              <time class="time">{{ item.date }}{{item.time}}</time>
              <el-button type="text" class="button" @click="routeToNew(item._id, item.count)">查看全文</el-button>
            </div>
          </div>
        </el-card>
      </div>
           <!-- 底部分页 -->
      <div class="col-12 mar20 d-none d-md-block" style="margin-top:15px;margin-bottom:15px">
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
      <div class="col-12 mar20 d-block d-md-none" style="margin-top:15px;margin-bottom:15px">
        <el-pagination
          small
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          layout="sizes, prev, pager"
          :total="total"
          :pager-count="5"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
const cityOptions = ['keji', 'meishi', 'shehui', 'caijing', 'shizheng', 'yule']
export default {
  data () {
    return {
      currentPage: 1,
      type: 0,
      datePick: '',
      currentDate: new Date(),
      value: this.$route.query.value,
      checkAll: false,
      checkedType: ['meishi', 'yule'],
      trans: {
        'keji': '科技',
        'shehui': '社会',
        'yule': '娱乐',
        'shizheng': '时政',
        'caijing': '财经',
        'meishi': '美食'
      },
      cities: cityOptions,
      isIndeterminate: true,
      newsData: [],
      tempData: [],
      total: 0,
      size: 5
    }
  },
  watch: {
    $route: {
      handler () {
        this.value = this.$route.query.value
        this.findNewByValue()
      },
      deep: true
    }
  },
  mounted () {
    this.findNewByValue()
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
      if (this.type === 1) {
        this.findNewByValue()
      }
      if (this.type === 2) {
        this.advSearch()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.type === 1) {
        this.findNewByValue()
      }
      if (this.type === 2) {
        this.advSearch()
      }
    },
    findNewByValue () {
      var that = this
      this.$axios.post('/findNewByValue', {
        data: {
          value: that.value,
          size: that.size,
          currentPage: that.currentPage
        }
      }).then((res) => {
        for (var i = 0; i < res.data.res.res.length; i++) {
          var aaa = new Blob([this._base64ToArrayBuffer(res.data.res.res[i].img[0])], { type: 'image/png' })
          res.data.res.res[i].img[0] = URL.createObjectURL(aaa)
        }
        that.tempData = res.data.res.res
        that.total = res.data.res.total
        that.type = res.data.res.type
      })
    },
    handleCheckAllChange (val) {
      this.checkedType = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
    transformArrayBufferToBase64 (buffer) {
      var binary = ''
      var bytes = new Uint8Array(buffer)
      for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    },
    _base64ToArrayBuffer (base64) {
      var binarystring = window.atob(base64)
      var len = binarystring.length
      var bytes = new Uint8Array(len)
      for (var i = 0; i < len; i++) {
        bytes[i] = binarystring.charCodeAt(i)
      }
      return bytes.buffer
    },
    changeTime () {
      console.log('aaaa', this.datePick)
    },
    advSearch () {
      this.$axios.post('/searchFindNew', {
        data: {
          datePick: this.datePick,
          checkedType: this.checkedType,
          size: this.size,
          currentPage: this.currentPage
        }
      }).then((res) => {
        for (var i = 0; i < res.data.res.res.length; i++) {
          var aaa = new Blob([this._base64ToArrayBuffer(res.data.res.res[i].img[0])], { type: 'image/png' })
          res.data.res.res[i].img[0] = URL.createObjectURL(aaa)
        }
        this.tempData = res.data.res.res
        this.total = res.data.res.total
        this.type = res.data.res.type
      })
    },
    routeToNew (id, count) {
      var index1 = 0
      this.$store.state.newsData.forEach((el, index) => {
        if (el._id === id) {
          index1 = index
        }
      })
      this.$router.push({name: 'new', params: {id: index1, _id: id, count: count}})
    }
  }
}
</script>
<style lang="less" scoped>
.searchFind {
  text-align: left;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.mar10 {
    margin: 20px 0;
}
/deep/ .el-date-editor .el-range-separator {
    width: 10%;
}
.newTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
