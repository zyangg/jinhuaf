<template>
  <div class="container reply" style="margin-top: 10px">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="card">
          <div class="card-header">{{postData[id].name}}</div>
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <p>{{postData[id].desc}}</p>
              <footer class="blockquote-footer">
                <cite title="Source Title">{{postData[id].author}}</cite>
              </footer>
            </blockquote>
          </div>
        </div>
        <div style="cursor:pointer">
          如果你喜欢这篇帖子可以给点个小爱心
          <span class="iconfont icon-xihuan" @click="likeReply()"></span>
        </div>
        <div class="textarea">
          <el-input type="textarea" v-model="form.desc" placeholder="在这里可以随意评论"></el-input>
          <div class="button" @click="publish">
            <el-button>发布</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-md-8" v-for="(item,index) in replyData" :key="index">
        <div class="card">
          <div class="card-body">
            <span>
              <el-button type="text" @click="getName($event, item._id, index)">{{item.name}}</el-button>
              说:{{item.desc}}
            </span>
            <span v-for="(item1,index1) in reply1Data[index]" :key="index1">
              <br />
              <el-button type="text" @click="getName($event, item._id, index)">{{item1.name2}}</el-button>对
              <el-button type="text" @click="getName($event, item._id, index)">{{item1.name1}}</el-button>
              说:{{item1.desc}}
            </span>
          </div>
          <div class="card-body" v-if="index === flag">
            <el-input type="textarea" v-model="form1.desc" :placeholder="`输入你相对${form1.name1}的话`"></el-input>
            <div class="button" @click="publishReply1">
              <el-button>发布</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        desc: '',
        name: '',
        podtId: ''
      },
      form1: {
        name1: '',
        name2: '',
        desc: '',
        name1Id: '',
        postId: ''
      },
      replyData: [],
      reply1Data: [],
      id: 0,
      postData: [
        {
          name: ''
        }
      ],
      flag: -1
    }
  },
  methods: {
    publishReply1 () {
      this.$axios
        .post('/publishReply1', {
          data: this.form1
        })
        .then(() => {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.moutedss(this.flag)
          this.flag = -1
        })
    },
    publish () {
      if (!sessionStorage.getItem('name')) {
        this.$router.push('/login')
      }
      this.form.postId = this.postData[this.$route.params.id]._id
      this.form.name = sessionStorage.getItem('name')
      this.$axios
        .post('/publishReply', {
          data: this.form
        })
        .then(() => {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.mouteds()
        })
    },
    getName (e, id, index) {
      this.flag = index
      this.form1.name1 = e.target.outerText
      this.form1.name2 = sessionStorage.getItem('name')
      this.form1.postId = this.postData[this.$route.params.id]._id
      this.form1.name1Id = id
    },
    mouteds () {
      this.$axios
        .post('/getReply', {
          data: this.postData[this.$route.params.id]._id
        })
        .then(async res => {
          this.replyData = res.data.res
          this.reply1Data = []
          for (var i = 0; i < this.replyData.length; i++) {
            await this.$axios
              .post('/getReply1', {
                data: this.replyData[i]._id
              })
              .then(res => {
                this.reply1Data.push(res.data.res)
              })
          }
        })
    },
    moutedss (flag) {
      this.$axios
        .post('/getReply1', {
          data: this.replyData[flag]._id
        })
        .then(res => {
          this.reply1Data.splice(flag, 1, res.data.res)
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
    likeReply () {
      this.$message({
        message: '帖子主已收到',
        type: 'success'
      })
    }
  },
  async mounted () {
    this.id = this.$route.params.id
    await this.$axios.get('/getPosts').then(res => {
      for (var i = 0; i < res.data.res.length; i++) {
        var aaa = new Blob([this._base64ToArrayBuffer(res.data.res[i].img)], {
          type: 'image/png'
        })
        res.data.res[i].img = URL.createObjectURL(aaa)
      }
      this.postData = res.data.res
    })
    this.mouteds()
  }
}
</script>
<style lang="less" scoped>
@import "../assets/font/iconfont.css";
.reply {
  text-align: left;
}
.textarea {
  margin-top: 10px;
}
.button {
  margin-top: 10px;
  float: right;
  margin-bottom: 10px;
}
</style>
