<template>
  <div class="container userSetting">
    <div class="row">
      <div class="col-12 flex" style="margin-top:20px;margin-bottom:20px;">
        <el-switch v-model="value" title="开启关闭" @change="openNews()"></el-switch>
        <el-button icon="el-icon-refresh" circle title="刷新" @click="refresh()"></el-button>
      </div>
      <div class="col-12">
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-4">{{$store.state.loginState}},你好！</h1>
            <p
              class="lead"
            >开启新闻推送，网站会为你推送你可能感兴趣的新闻</p>
          </div>
        </div>
      </div>
      <div
        v-if="value"
        class="col-sm-6 col-12 col-md-4 col-lg-4"
        v-for="(item,index) in tempData"
        :key="index"
      >
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom:20px">
          <img
            :src="item.img"
            class="image"
            height="200px"
          />
          <div style="padding: 14px;height:100px">
            <div class="newTitle">{{item.title}}</div>
            <div class="bottom clearfix">
              <time class="time">{{ item.date }}{{item.time}}</time>
              <el-button type="text" class="button" @click="$router.push({name: 'new',
                params: {_id: item._id, count: item.count}})">查看新闻</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 底部分页 -->
      <div class="col-12 d-none d-md-block" style="margin-top:20px;margin-bottom:20px" v-if="value">
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
      <div class="col-12 d-block d-md-none" style="margin-top:20px;margin-bottom:20px" v-if="value">
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
export default {
  name: 'userSetting',
  data () {
    return {
      currentDate: new Date(),
      value: false,
      newsCount: [],
      newsType: [],
      midNum: 0,
      userInfo: null,
      tempData: [],
      total: 0,
      size: 5,
      currentPage: 1
    }
  },
  mounted () {
    this.getOneUser()
  },
  beforeRouteEnter (to, from, next) {
    const store = from.matched[0].instances.default.$store
    const message = from.matched[0].instances.default.$message
    const router = from.matched[0].instances.default.$router
    if (!store.state.loginState) {
      message('您需要登录才能开启新闻推送功能')
      router.push('/login')
      next()
    } else {
      next()
    }
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
      this.advSearch()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.advSearch()
    },
    openNews () {
      this.newsType = []
      if (this.userInfo.yule > this.midNum) {
        this.newsType.push('yule')
      }
      if (this.userInfo.meishi > this.midNum) {
        this.newsType.push('meishi')
      }
      if (this.userInfo.caijing > this.midNum) {
        this.newsType.push('caijing')
      }
      if (this.userInfo.shehui > this.midNum) {
        this.newsType.push('shehui')
      }
      if (this.userInfo.shizheng > this.midNum) {
        this.newsType.push('shizheng')
      }
      if (this.userInfo.keji > this.midNum) {
        this.newsType.push('keji')
      }
      this.advSearch()
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
    advSearch () {
      this.tempData = []
      this.$axios.post('/searchFindNew', {
        data: {
          datePick: null,
          checkedType: this.newsType,
          size: this.size,
          currentPage: this.currentPage
        }
      }).then((res) => {
        for (var i = 0; i < res.data.res.res.length; i++) {
          var aaa = new Blob([this._base64ToArrayBuffer(res.data.res.res[i].img[0])], { type: 'image/png' })
          res.data.res.res[i].img = URL.createObjectURL(aaa)
        }
        this.tempData = res.data.res.res
        this.total = res.data.res.total
      })
    },
    getOneUser () {
      this.$axios.post('/getOneUser', {
        data: this.$store.state.loginState
      }).then((data) => {
        this.userInfo = data.data.res
        this.newsCount.push(data.data.res.yule)
        this.newsCount.push(data.data.res.meishi)
        this.newsCount.push(data.data.res.caijing)
        this.newsCount.push(data.data.res.shizheng)
        this.newsCount.push(data.data.res.keji)
        this.newsCount.push(data.data.res.shehui)
        this.midNum = this.getMedNum(this.newsCount)
      })
    },
    // 求中位数
    getMedNum (arr) {
      arr.sort(function (a, b) { return a - b })
      var l = arr.length - 1
      var n = Math.floor(l / 2)
      var mid = (arr[n] + arr[l - n]) / 2
      return mid
    },
    // 刷新
    refresh () {
      this.advSearch()
    }
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userSetting {
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
/deep/ .el-icon-refresh:before {
  font-size: 20px;
}
.jumbotron {
    background-color: white;
}
.newTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
