<template>
  <div class="container reply" style="margin-top: 10px">
         <el-backtop></el-backtop>
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="jumbotron" v-if="postData.length > 0">
          <h1 class="display-3" style="font-size:2.8rem">{{postData[id].name}}</h1>
          <p class="lead">{{postData[id].desc}}</p>
          <hr class="my-4" />
          <p>{{postData[id].author}}</p>
          <p style="cursor:pointer">
            <span>如果你喜欢这篇帖子可以给点个小爱心</span>
            <span
              class="iconfont icon-xihuan"
              @click="likeReply(postData[id]._id, postData[id].like)"
            ></span>
          </p>
        </div>
        <div class="textarea">
          <el-input
            type="textarea"
            v-model="form.desc"
            placeholder="在这里可以随意评论"
            maxlength="50"
            show-word-limit
          ></el-input>
          <div class="button" @click="publish(postData[id].reply)">
            <el-button>发布</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center" v-if="replyData.length > 0" style="margin-bottom:100px">
      <div
        class="col-12 col-md-8"
        v-for="(item,index) in replyData"
        :key="index"
        style="margin-top:10px"
      >
        <div class="flex">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>&nbsp;&nbsp;
          <span>{{item.name}}</span>
        </div>
        <div style="padding-left:50px;" class="flex1">
          <span>{{item.desc}}</span>
          <span>
            <span style="cursor:pointer" @click="getName($event, item._id, index, item.name)">
              <i class="el-icon-chat-round"></i>
            </span>
            <span
              style="cursor:pointer"
              @click="delComment(item._id)"
              v-if="$store.state.isManager || item.name === $store.state.loginState"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
        <div style="padding-left:50px;">
          <div v-for="(item1,index1) in reply1Data[index]" :key="index1" style="margin-top:10px">
            <div class="flex">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>&nbsp;&nbsp;
              <span>{{item1.name2}}</span>
            </div>
            <div class="flex1" style="padding-left:50px;">
              <span>{{item1.desc}}</span>
              <span>
                <span style="cursor:pointer" @click="getName($event, item._id, index, item1.name2)">
                  <i class="el-icon-chat-round"></i>
                </span>
                <span
                  style="cursor:pointer"
                  @click="delReply(item1._id)"
                  v-if="$store.state.isManager || item1.name2 === $store.state.loginState"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="card-body" v-if="index === flag">
          <el-input type="textarea" v-model="form1.desc" :placeholder="`输入你想对${form1.name1}的话`"></el-input>
          <div class="button">
            <el-button @click="publishReply1">回复</el-button>
            <el-button @click="flag = -1">取消</el-button>
          </div>
        </div>
        <!-- <div class="card">
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
        </div>-->
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
        podtId: '',
        reply: 0
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
      postData: [],
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
          this.form1.desc = ''
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.moutedss(this.flag)
          this.flag = -1
        })
    },
    publish (reply) {
      if (!sessionStorage.getItem('name')) {
        this.$router.push('/login')
      }
      this.form.postId = this.postData[0]._id
      this.form.name = sessionStorage.getItem('name')
      this.form.reply = reply
      this.$axios
        .post('/publishReply', {
          data: this.form
        })
        .then(() => {
          this.form.desc = ''
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.mouteds()
        })
    },
    getName (e, id, index, name) {
      this.flag = index
      this.form1.name1 = name
      this.form1.name2 = sessionStorage.getItem('name')
      this.form1.postId = this.postData[0]._id
      this.form1.name1Id = id
    },
    delReply (id) {
      this.$axios
        .post('/delPostReply', {
          data: id
        })
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.desc = ''
          this.mouteds()
        })
    },
    delComment (id, reply) {
      this.$axios
        .post('/delPostComment', {
          data: {
            id,
            postId: this.postData[0]._id,
            reply: this.postData[0].reply
          }
        })
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.mouteds()
          this.desc = ''
        })
    },
    mouteds () {
      this.$axios
        .post('/getReply', {
          data: this.postData[0]._id
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
    likeReply (postId, like) {
      this.$axios
        .post('/likePost', {
          data: {
            postId,
            like
          }
        })
        .then(() => {
          this.$message({
            message: '帖子主已收到',
            type: 'success'
          })
        })
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
  },
  async mounted () {
    await this.$axios
      .post('/getPostsOne', {
        data: this.$route.params.id
      })
      .then(res => {
        this.postData = res.data.res
        console.log('res', res.data.res[0])
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
.flex {
  display: flex;
  align-items: center;
}
.flex1 {
  display: flex;
  justify-content: space-between;
}
/deep/ .el-icon-chat-round:before {
  font-size: 20px;
}
/deep/ .el-icon-delete:before {
  font-size: 20px;
}
</style>
