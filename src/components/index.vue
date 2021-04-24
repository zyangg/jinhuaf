<template>
  <div class="container marBottom index">
    <div class="row">
      <!-- 轮播图区域 -->
      <div class="col-lg-8 col-md-12 col-12">
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="../assets/new-1.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="../assets/new-2.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="../assets/new-3.jpg" class="d-block w-100" alt="..." />
            </div>
          </div>
          <a
            class="carousel-control-prev"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a
            class="carousel-control-next"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
      <!-- 新闻排行版 -->
      <div class="col-lg-4 col-md-12 col-12">
        <div class="card-header">热点新闻</div>
        <div class="card" v-for="(item,index) in topnews" :key="index">
          <el-button
            type="text"
            @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
          >
            <span class="iconfont icon-zhiding"></span>
            {{ item.title }}
          </el-button>
        </div>
        <ul class="list-group">
          <li class="list-group-item flex" v-for="(item,index) in newRank" :key="index">
            <img
              class="mr-3"
              :src="newRank[index].img"
              width="50px"
              height="50px"
            />
            <el-button
              type="text"
              @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
            >{{index+1}}.{{ item.title }}</el-button>
          </li>
        </ul>
      </div>
      <!-- 新闻模块 -->
      <div class="col-lg-8 col-md-12 col-12 text" style="margin-top:10px;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
          <el-tab-pane label="全部新闻" name="first">
            <div
              class="card"
              v-for="(item,index) in newsData"
              :key="index"
              v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
            >
              <div class="card-body flex1">
                <div>
                  <h5 class="card-title">{{item.title}}</h5>
                  <p class="card-text">{{item.describe}}</p>
                </div>
                <img :src="item.img" width="100px" height="100px" />
              </div>
              <div class="card-body">
                <button
                  class="btn btn-light"
                  @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
                >查看完整新闻</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="娱乐新闻" name="second">
            <div
              class="card"
              v-for="(item,index) in yule"
              :key="index"
              v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
            >
              <div class="card-body">
                <h5 class="card-title">{{item.title}}</h5>
                <p class="card-text">{{item.describe}}</p>
                <button
                  class="btn btn-light"
                  @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
                >查看完整新闻</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="美食新闻" name="third">
            <div
              class="card"
              v-for="(item,index) in meishi"
              :key="index"
              v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
            >
              <div class="card-body">
                <h5 class="card-title">{{item.title}}</h5>
                <p class="card-text">{{item.describe}}</p>
                <button
                  class="btn btn-light"
                  @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
                >查看完整新闻</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="社会新闻" name="fourth">
            <div
              class="card"
              v-for="(item,index) in shehui"
              :key="index"
              v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
            >
              <div class="card-body">
                <h5 class="card-title">{{item.title}}</h5>
                <p class="card-text">{{item.describe}}</p>
                <button
                  class="btn btn-light"
                  @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
                >查看完整新闻</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="财经新闻" name="five">
            <div
              class="card"
              v-for="(item,index) in caijing"
              :key="index"
              v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
            >
              <div class="card-body">
                <h5 class="card-title">{{item.title}}</h5>
                <p class="card-text">{{item.describe}}</p>
                <button
                  class="btn btn-light"
                  @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
                >查看完整新闻</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="时政新闻" name="six">
            <div
              class="card"
              v-for="(item,index) in shizheng"
              :key="index"
              v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
            >
              <div class="card-body">
                <h5 class="card-title">{{item.title}}</h5>
                <p class="card-text">{{item.describe}}</p>
                <button
                  class="btn btn-light"
                  @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
                >查看完整新闻</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="科技新闻" name="seven">
            <div
              class="card"
              v-for="(item,index) in keji"
              :key="index"
              v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
            >
              <div class="card-body">
                <h5 class="card-title">{{item.title}}</h5>
                <p class="card-text">{{item.describe}}</p>
                <button
                  class="btn btn-light"
                  @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
                >查看完整新闻</button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="col-lg-4 col-md-12 col-12" style="margin-top: 10px">
        <div class="row">
          <div class="col-lg-12 col-md-3 col-6">
            <div class="card bg-light mb-3" style="max-width: 20rem;">
              <div class="card-header">Header</div>
              <div class="card-body">
                <h5 class="card-title">Primary card title</h5>
                <p
                  class="card-text"
                >Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
           <div class="col-lg-12 col-md-3 col-6">
            <div class="card bg-light mb-3" style="max-width: 20rem;">
              <div class="card-header">Header</div>
              <div class="card-body">
                <h5 class="card-title">Primary card title</h5>
                <p
                  class="card-text"
                >Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
           <div class="col-lg-12 col-md-3 col-6">
            <div class="card bg-light mb-3" style="max-width: 20rem;">
              <div class="card-header">Header</div>
              <div class="card-body">
                <h5 class="card-title">Primary card title</h5>
                <p
                  class="card-text"
                >Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
           <div class="col-lg-12 col-md-3 col-6">
            <div class="card bg-light mb-3" style="max-width: 20rem;">
              <div class="card-header">Header</div>
              <div class="card-body">
                <h5 class="card-title">Primary card title</h5>
                <p
                  class="card-text"
                >Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部分页 -->
      <div class="col-12 mar20">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      total: 0,
      size: 5,
      currentPage: 1,
      newRank: [],
      topnews: [],
      newsData: [],
      meishi: [],
      keji: [],
      shizheng: [],
      shehui: [],
      caijing: [],
      yule: [],
      activeName: 'first'
    }
  },
  mounted () {
    this.$axios.get('/getNews').then(res => {
      for (var i = 0; i < res.data.res.length; i++) {
        var aaa = new Blob([this._base64ToArrayBuffer(res.data.res[i].img)], {
          type: 'image/png'
        })
        res.data.res[i].img = URL.createObjectURL(aaa)
      }
      this.newsData = res.data.res
      this.total = this.newsData.length
      res.data.res.forEach(el => {
        if (el.type === 'meishi') {
          this.meishi.push(el)
        }
        if (el.type === 'keji') {
          this.keji.push(el)
        }
        if (el.type === 'caijing') {
          this.caijing.push(el)
        }
        if (el.type === 'shehui') {
          this.shehui.push(el)
        }
        if (el.type === 'yule') {
          this.yule.push(el)
        }
        if (el.type === 'shizheng') {
          this.shizheng.push(el)
        }
      })
      this.$store.commit('saveNew', res.data.res)
    })
    this.$axios.get('/newRanking').then(res => {
      for (var i = 0; i < res.data.res.length; i++) {
        var aaa = new Blob([this._base64ToArrayBuffer(res.data.res[i].img)], {
          type: 'image/png'
        })
        res.data.res[i].img = URL.createObjectURL(aaa)
      }
      this.newRank = res.data.res
    })
    this.$axios.get('/getTopArticle').then(res => {
      console.log('dart', res.data.res)
      this.topnews = res.data.res
    })
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    handleClick (activeName) {
      this.currentPage = 1
      if (activeName === 'first') {
        this.total = this.newsData.length
      }
      if (activeName === 'second') {
        this.total = this.yule.length
      }
      if (activeName === 'third') {
        this.total = this.meishi.length
      }
      if (activeName === 'fourth') {
        this.total = this.shehui.length
      }
      if (activeName === 'five') {
        this.total = this.caijing.length
      }
      if (activeName === 'six') {
        this.total = this.shizheng.length
      }
      if (activeName === 'seven') {
        this.total = this.keji.length
      }
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
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/font/iconfont.css";
.index {
  text-align: left;
}
.jumbotron {
  height: 200px;
}
.text {
  text-align: left;
}
.mar20 {
  margin: 20px 0;
}
.marBottom {
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-button {
  line-height: normal;
  color: black!important;
  overflow: hidden!important;
  text-overflow:ellipsis!important;
  white-space: nowrap!important;
}
.el-pagination {
  white-space: normal;
}
.flex {
  display: flex;
}
.flex1 {
  display: flex;
  justify-content: space-between;
}
.floatR {
  float: right;
}

// @media (min-width: 576px) { ... }

// Medium devices (tablets, 768px and up)
// @media (min-width: 768px) { ... }

// Large devices (desktops, 992px and up)
// @media (min-width: 992px) { ... }

// Extra large devices (large desktops, 1200px and up)
// @media (min-width: 1200px) { ... }
</style>
