<template>
  <div class="container index">
    <div class="row">
      <!-- 左侧 -->
      <div class="col-12 col-lg-8">
        <!-- 轮播图 -->
        <div style="margin-top:15px">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item>
              <img src="../assets/new-2.jpg" alt width="100%" height="100%" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="../assets/new-1.jpg" alt width="100%" height="100%" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="../assets/new-3.jpg" alt width="100%" height="100%" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 轮播图end -->
        <!-- 新闻排行榜 -->
        <div class="d-block d-lg-none" style="margin-top:15px">
          <div class="card-header" style="text-align:center">热点新闻</div>
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
              <img class="mr-3" :src="newRank[index].img" width="50px" height="50px" />
              <el-button
                type="text"
                @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
              >{{index+1}}.{{ item.title }}</el-button>
            </li>
          </ul>
        </div>
        <!-- 新闻排行榜end -->
        <!-- 新闻模块 -->
        <div style="margin-top:15px">
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
                  <img :src="item.img" width="100px" height="100px" class="d-none d-md-block" />
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
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="美食新闻" name="third">
              <div
                class="card"
                v-for="(item,index) in meishi"
                :key="index"
                v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
              >
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="社会新闻" name="fourth">
              <div
                class="card"
                v-for="(item,index) in shehui"
                :key="index"
                v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
              >
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="财经新闻" name="five">
              <div
                class="card"
                v-for="(item,index) in caijing"
                :key="index"
                v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
              >
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="时政新闻" name="six">
              <div
                class="card"
                v-for="(item,index) in shizheng"
                :key="index"
                v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
              >
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="科技新闻" name="seven">
              <div
                class="card"
                v-for="(item,index) in keji"
                :key="index"
                v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
              >
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img" width="100px" height="100px" class="d-none d-md-block" />
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
          </el-tabs>
        </div>
        <!-- 新闻模块end -->
      </div>
      <!-- 右侧 -->
      <div class="col-12 col-lg-4">
        <!-- 新闻排行榜 -->
        <div class="d-none d-lg-block">
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
              <img class="mr-3" :src="newRank[index].img" width="50px" height="50px" />
              <el-button
                type="text"
                @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
              >{{index+1}}.{{ item.title }}</el-button>
            </li>
          </ul>
        </div>
        <!-- 了解更多 -->
        <div style="margin-top:20px">
          <div>了解更多</div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="GITHUB" name="1">
              <div>本项目开源，如果发现项目存在什么缺陷或者对项目有什么好的建议，可以在GITHUB给我留言</div>
              <div class="button">
                <svg
                  aria-labelledby="simpleicons-github-dark-icon"
                  lang
                  role="img"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title id="simpleicons-github-dark-icon" lang="en">GitHub Dark icon</title>
                  <path
                    fill="#7F8C8D"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
                <span>
                  <a href="https://github.com/zyangg/jinhuaf">前端代码</a>
                </span>
              </div>
              <div class="button">
                <svg
                  aria-labelledby="simpleicons-github-dark-icon"
                  lang
                  role="img"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title id="simpleicons-github-dark-icon" lang="en">GitHub Dark icon</title>
                  <path
                    fill="#7F8C8D"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
                <span>
                  <a href="https://github.com/zyangg/jinhuae">后端代码</a>
                </span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="网站评分" name="2">
              <div>你对本网站还满意吗</div>
              <div>
                <el-rate v-model="value" show-text></el-rate>
              </div>
            </el-collapse-item>
            <el-collapse-item title="加入我们" name="3">
              <div>
                如果相加入我们，一起来开发维护金华求新新闻网站可以发送邮箱到
                <span>1511191171@qq.com</span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="网站信息" name="4">本文站旨在给广大用户介绍金华新闻。顺便完成毕业设计</el-collapse-item>
            <el-collapse-item title="关于作者" name="5">作者：lianheng</el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!-- 底部分页 -->
      <div class="col-12 d-none d-md-block" style="margin-top:20px;margin-bottom:20px">
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
      <div class="col-12 d-block d-md-none" style="margin-top:20px;margin-bottom:20px">
        <el-pagination
          small
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="1"
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
      activeName: 'first',
      activeNames: ['1', '2', '3', '4', '5'],
      value: null
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
    handleChange (val) {
      console.log(val)
    },
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
.card-body {
    padding: 0.75rem!important;

}
.button {
  padding: 0.7em 2em;
  border-radius: 2em;
  display: inline-block;
  text-align: center;
  background-color: #f6f6f6;
  color: #4f5959;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid transparent;
  span {
    a {
      text-decoration: none;
      color: #304455;
    }
  }
}
.index {
  text-align: left;
  margin-top: 10px;
}
.el-button {
  line-height: normal;
  color: black !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
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
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
