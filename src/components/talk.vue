<template>
  <div class="container talk">
    <div class="row">
      <div class="col-12">
        <div class="row marTop">
          <div class="col-12">
            <button
              type="button"
              class="btn btn-light btn-lg btn-block"
              @click="$router.push('/publishPost')"
            >我要发贴</button>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-4 col-sm-6 col-12" v-for="(item,index) in this.postData" :key="index"
      v-show="index > (size*(currentPage-1) - 1) && index < size*(currentPage)"
      >
        <div class="card">
          <img class="card-img-top" :src="item.img" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">{{item.name}}</h5>
            <p
              class="card-text"
            >{{item.desc}}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">发帖人: {{item.author}}</li>
            <li class="list-group-item">时间：{{item.date}}-{{item.time}}</li>
            <li class="list-group-item">
             <span class="iconfont icon-xihuan marlr">
               <span class="font">{{item.like}}</span></span>
             <span class="iconfont icon-pinglun marlr">
               <span class="font">{{replyNum}}</span></span>
            </li>
          </ul>
          <div class="card-body">
            <el-button type="text" class="card-link" @click="goReply(index)">看帖子</el-button>
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
      currentPage: 1
    }
  },
  methods: {
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
    goReply (index) {
      this.$router.push({name: 'reply', params: {id: index}})
    },
    getReply (id) {
      var self = this
      this.$axios.post('/getReply', {data: id}).then((res) => {
        self.replyNum = res.data.res.length
      })
    },
    handleSizeChange (val) {
      this.size = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    }
  },
  mounted () {
    this.$axios.get('/getPosts').then((res) => {
      for (var i = 0; i < res.data.res.length; i++) {
        var aaa = new Blob([this._base64ToArrayBuffer(res.data.res[i].img)], { type: 'image/png' })
        res.data.res[i].img = URL.createObjectURL(aaa)
        this.getReply(res.data.res[i]._id)
      }
      this.postData = res.data.res
      this.total = this.postData.length
      this.$store.commit('savePost', res.data.res)
    })
  }
}
</script>

<style scoped lang="less">
@import '../assets/font/iconfont.css';
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
</style>
