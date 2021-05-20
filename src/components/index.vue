<template>
  <div class="container index">
    <div class="row">
      <!-- 左侧 -->
      <div class="col-12 col-lg-8">
        <!-- 轮播图 -->
        <div style="margin-top:15px" class="parent">
          <el-carousel :interval="5000" arrow="always" indicator-position="outside">
            <el-carousel-item v-for="(item,index) in carouselNewData" :key="index">
              <img
                :src="item.img[0]"
                alt
                width="100%"
                height="100%"
                @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
              />
              <div class="children">{{item.title}}</div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 轮播图end -->
        <!-- 新闻排行榜 -->
        <div class="d-block d-lg-none" style="margin-top:15px">
          <div class="card-header" style="text-align:center">热点新闻</div>
          <div class="card" v-for="(item,index) in topnews" :key="index" style="padding-left:20px">
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
              <img class="mr-3" :src="newRank[index].img[0]" width="50px" height="50px" />
              <el-button
                type="text"
                @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
              >{{index+1}}.{{ item.title }}</el-button>
            </li>
          </ul>
        </div>
        <!-- 新闻排行榜end -->
        <!-- 了解更多 -->
        <div style="margin-top:20px" class="d-block d-lg-none">
          <div>了解更多</div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="网站信息" name="1">
              <div class="flex2">
                <span>娱乐新闻
                </span>
                <span>{{yuleNum}}</span>
                <span>科技新闻</span>
                <span>{{kejiNum}}</span>
                <span>美食新闻</span>
                <span>{{meishiNum}}</span>
              </div>
              <div class="flex2">
                <span>社会新闻</span>
                <span>{{shehuiNum}}</span>
                <span>财经新闻</span>
                <span>{{caijingNum}}</span>
                <span>时政新闻</span>
                <span>{{shizhengNum}}</span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="GITHUB" name="2">
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
            <el-collapse-item title="相关链接" name="3">
              <span style="margin-right:20px">
                <a href="https://www.jinhua.com.cn/">金华网</a>
              </span>
              <span>
                <a href="https://www.jhnews.com.cn/">金华新闻网</a>
              </span>
            </el-collapse-item>
            <el-collapse-item title="加入我们" name="4">
              <div>
                如果相加入我们，一起来开发维护金华求新新闻网站可以发送邮箱到
                <span>1511191171@qq.com</span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="关于作者" name="5">作者：lianheng</el-collapse-item>
          </el-collapse>
        </div>
        <!-- 新闻模块 -->
        <div style="margin-top:15px">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
            <el-tab-pane label="全部新闻" name="all">
              <div class="card" v-for="(item,index) in newsData" :key="index">
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img[0]" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="娱乐新闻" name="yule">
              <div class="card" v-for="(item,index) in yule" :key="index">
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img[0]" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="美食新闻" name="meishi">
              <div class="card" v-for="(item,index) in meishi" :key="index">
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img[0]" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="社会新闻" name="shehui">
              <div class="card" v-for="(item,index) in shehui" :key="index">
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img[0]" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="财经新闻" name="caijing">
              <div class="card" v-for="(item,index) in caijing" :key="index">
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img[0]" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="时政新闻" name="shizheng">
              <div class="card" v-for="(item,index) in shizheng" :key="index">
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img[0]" width="100px" height="100px" class="d-none d-md-block" />
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
            <el-tab-pane label="科技新闻" name="keji">
              <div class="card" v-for="(item,index) in keji" :key="index">
                <div class="card-body flex1">
                  <div>
                    <h5 class="card-title">{{item.title}}</h5>
                    <p class="card-text">{{item.describe}}</p>
                  </div>
                  <img :src="item.img[0]" width="100px" height="100px" class="d-none d-md-block" />
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
          <div class="card" v-for="(item,index) in topnews" :key="index" style="padding-left:20px">
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
              <img class="mr-3" :src="newRank[index].img[0]" width="50px" height="50px" />
              <el-button
                type="text"
                @click="$router.push({name: 'new',
                    params: {_id: item._id, count: item.count}})"
              >{{index+1}}.{{ item.title }}</el-button>
            </li>
          </ul>
        </div>
        <!-- 了解更多 -->
        <div style="margin-top:20px" class="d-none d-lg-block">
          <div>了解更多</div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="网站信息" name="1">
              <div id="mainPie" :style="{width: '300px', height: '350px'}"></div>
            </el-collapse-item>
            <el-collapse-item title="GITHUB" name="2">
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
            <el-collapse-item title="相关链接" name="3">
              <span style="margin-right:20px">
                <a href="https://www.jinhua.com.cn/" style="color:black">金华网</a>
              </span>
              <span>
                <a href="https://www.jhnews.com.cn/" style="color:black">金华新闻网</a>
              </span>
            </el-collapse-item>
            <el-collapse-item title="加入我们" name="4">
              <div>
                如果相加入我们，一起来开发维护金华求新新闻网站可以发送邮箱到
                <span>1511191171@qq.com</span>
              </div>
            </el-collapse-item>
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
          :pager-count="5"
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
      carouselNewData: [],
      topnews: [],
      newsData: [],
      meishi: [],
      keji: [],
      shizheng: [],
      shehui: [],
      caijing: [],
      yule: [],
      activeName: 'all',
      activeNames: ['1', '2', '3', '4', '5'],
      value: null,
      valueCalendar: new Date(),
      flag: 0,
      yuleNum: 0,
      kejiNum: 0,
      meishiNum: 0,
      shizhengNum: 0,
      shehuiNum: 0,
      caijingNum: 0
    }
  },
  async mounted () {
    await this.getnewRanking()
    await this.getTopArticle()
    await this.findAllNewPage()
    await this.findTypeNewPage()
    await this.getCarouselNewData()
    await this.getTypeNewNum()
  },
  methods: {
    getTypeNewNum () {
      this.$axios.get('/getTypeNewNum').then(res => {
        this.yuleNum = res.data.res.yule
        this.kejiNum = res.data.res.keji
        this.shizhengNum = res.data.res.shizheng
        this.meishiNum = res.data.res.meishi
        this.caijingNum = res.data.res.caijing
        this.shehuiNum = res.data.res.shehui
        var chartDom = document.getElementById('mainPie')
        var myChart = this.$echarts.init(chartDom)
        var option
        option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '0%',
            left: 'center'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              },
              data: [
                { value: this.yuleNum, name: '娱乐新闻' },
                { value: this.meishiNum, name: '美食新闻' },
                { value: this.caijingNum, name: '财经新闻' },
                { value: this.shehuiNum, name: '社会新闻' },
                { value: this.shizhengNum, name: '时政新闻' },
                { value: this.kejiNum, name: '科技新闻' }
              ]
            }
          ]
        }
        option && myChart.setOption(option)
      })
    },
    getCarouselNewData () {
      this.$axios.get('/getCarouselNewData').then(res => {
        for (var i = 0; i < res.data.res.length; i++) {
          if (res.data.res[i].img[0]) {
            var aaa = new Blob(
              [this._base64ToArrayBuffer(res.data.res[i].img[0])],
              {
                type: 'image/png'
              }
            )
            res.data.res[i].img[0] = URL.createObjectURL(aaa)
          }
        }
        this.carouselNewData = res.data.res
      })
    },
    findTypeNewPage (type) {
      this.$axios
        .post('/findTypeNewPage', {
          data: {
            size: this.size,
            currentPage: this.currentPage,
            type
          }
        })
        .then(res => {
          for (var i = 0; i < res.data.res.res.length; i++) {
            if (res.data.res.res[i].img[0]) {
              var aaa = new Blob(
                [this._base64ToArrayBuffer(res.data.res.res[i].img[0])],
                {
                  type: 'image/png'
                }
              )
              res.data.res.res[i].img[0] = URL.createObjectURL(aaa)
            }
          }
          if (type === 'meishi') {
            this.meishi = res.data.res.res
          }
          if (type === 'shehui') {
            this.shehui = res.data.res.res
          }
          if (type === 'yule') {
            this.yule = res.data.res.res
          }
          if (type === 'shizheng') {
            this.shizheng = res.data.res.res
          }
          if (type === 'caijing') {
            this.caijing = res.data.res.res
          }
          if (type === 'keji') {
            this.keji = res.data.res.res
          }
          this.total = res.data.res.total
          this.flag = res.data.res.flag
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
          for (var i = 0; i < res.data.res.res.length; i++) {
            if (res.data.res.res[i].img[0]) {
              var aaa = new Blob(
                [this._base64ToArrayBuffer(res.data.res.res[i].img[0])],
                {
                  type: 'image/png'
                }
              )
              res.data.res.res[i].img[0] = URL.createObjectURL(aaa)
            }
          }
          this.newsData = res.data.res.res
          this.total = res.data.res.total
          this.flag = res.data.res.flag
        })
    },
    getnewRanking () {
      this.$axios.get('/newRanking').then(res => {
        for (var i = 0; i < res.data.res.length; i++) {
          if (res.data.res[i].img[0]) {
            var aaa = new Blob(
              [this._base64ToArrayBuffer(res.data.res[i].img[0])],
              {
                type: 'image/png'
              }
            )
            res.data.res[i].img[0] = URL.createObjectURL(aaa)
          }
        }
        this.newRank = res.data.res
      })
    },
    getTopArticle () {
      this.$axios.get('/getTopArticle').then(res => {
        this.topnews = res.data.res
      })
    },
    handleChange (val) {
      console.log(val)
    },
    handleSizeChange (val) {
      this.size = val
      if (this.flag === 1) {
        this.currentPage = 1
        this.findAllNewPage()
      }
      if (this.flag === 2) {
        this.currentPage = 1
        this.findTypeNewPage(this.activeName)
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.flag === 1) {
        this.findAllNewPage()
      }
      if (this.flag === 2) {
        this.findTypeNewPage(this.activeName)
      }
    },
    handleClick (activeName) {
      this.currentPage = 1
      if (activeName === 'all') {
        this.findAllNewPage()
      }
      if (activeName === 'yule') {
        this.findTypeNewPage('yule')
      }
      if (activeName === 'meishi') {
        this.findTypeNewPage('meishi')
      }
      if (activeName === 'shehui') {
        this.findTypeNewPage('shehui')
      }
      if (activeName === 'caijing') {
        this.findTypeNewPage('caijing')
      }
      if (activeName === 'shizheng') {
        this.findTypeNewPage('shizheng')
      }
      if (activeName === 'keji') {
        this.findTypeNewPage('keji')
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
  padding: 0.75rem !important;
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
  text-align: left;
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
.flex2 {
  display: flex;
  justify-content: space-around;
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
.parent {
  position: relative;
}
.children {
  width: 100%;
  text-align: center;
  position: absolute;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  left: 0px;
  bottom: 0px;
  z-index: 999;
}
/deep/ .el-carousel__arrow {
  width: 45px;
  height: 45px;
}
/deep/ .el-icon-arrow-left:before {
  font-size: 25px;
}
/deep/ .el-icon-arrow-right:before {
  font-size: 25px;
}
</style>
