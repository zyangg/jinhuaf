<template>
  <div class="container talk">
    <div class="row">
      <div class="col-12">
        <div class="row marTop">
          <div class="col-12 flex">
            <div>
              <el-input
                placeholder="请输入内容"
                v-model="searchArticle"
                clearable
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search" circle @click="search()"></el-button>
              </el-input>
            </div>
            <div>
              <el-button type="primary" icon="el-icon-plus" circle @click="publishPost()"></el-button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="col-lg-3 col-md-4 col-sm-6 col-12"
        v-for="(item,index) in this.postData"
        :key="index"
      >
        <div class="card" style="margin-top:15px">
          <img class="card-img-top" :src="item.img[0]" alt width="100%" height="200px" />
          <div class="card-body">
            <h5 class="card-title ellipis">{{item.name}}</h5>
            <p class="card-text ellipis">{{item.desc}}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">发帖人: {{item.author}}</li>
            <li class="list-group-item">时间：{{item.date}}-{{item.time}}</li>
            <li class="list-group-item">
              <span class="iconfont icon-xihuan marlr">
                <span class="font">{{item.like}}</span>
              </span>
              <span class="iconfont icon-pinglun marlr">
                <span class="font">{{item.reply}}</span>
              </span>
            </li>
          </ul>
          <div class="card-body">
            <el-button type="text" class="card-link" @click="goReply(item._id)">看帖子</el-button>
          </div>
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
          :page-size="size"
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
  name: 'talk',
  data () {
    return {
      postData: [],
      replyNum: 0,
      total: 0,
      size: 5,
      currentPage: 1,
      searchArticle: ''
    }
  },
  methods: {
    search () {
      if (this.searchArticle === '') {
        this.getPosts()
      } else {
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
        for (var i = 0; i < res.data.res.res.length; i++) {
          var aaa = new Blob(
            [this._base64ToArrayBuffer(res.data.res.res[i].img[0])],
            { type: 'image/png' }
          )
          res.data.res.res[i].img[0] = URL.createObjectURL(aaa)
          this.getReply(res.data.res.res[i]._id)
        }
        this.postData = res.data.res.res
        this.total = res.data.res.total
      })
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
    goReply (id) {
      this.$router.push({ name: 'reply', params: { id } })
    },
    getReply (id) {
      var self = this
      this.$axios.post('/getReply', { data: id }).then(res => {
        self.replyNum = res.data.res.length
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.getPosts()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getPosts()
    },
    publishPost () {
      if (this.$store.state.loginState === null) {
        this.$message('请先登录')
      } else {
        this.$router.push('/publishPost')
      }
    },
    getPosts () {
      this.$axios
        .post('/getPosts', {
          data: {
            size: this.size,
            currentpage: this.currentPage
          }
        })
        .then(res => {
          for (var i = 0; i < res.data.res.res.length; i++) {
            var aaa = new Blob(
              [this._base64ToArrayBuffer(res.data.res.res[i].img[0])],
              { type: 'image/png' }
            )
            res.data.res.res[i].img[0] = URL.createObjectURL(aaa)
            this.getReply(res.data.res.res[i]._id)
          }
          this.postData = res.data.res.res
          this.total = res.data.res.total
        })
    }
  },
  mounted () {
    this.getPosts()
  }
}
</script>

<style scoped lang="less">
@import "../assets/font/iconfont.css";
.talk {
  text-align: left;
}
.marTop {
  margin: 10px 0;
}
.marlr {
  margin: 0 5px;
}
.font {
  margin: 0 8px;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.ellipis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
