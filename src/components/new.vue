<template>
  <div class="container new">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="row">
          <div class="col-12">
            <h3>{{newsData.title}}</h3>
          </div>
        </div>
        <div class="row mar10">
          <div class="col-6">{{newsData.date}} {{newsData.time}}</div>
          <div class="col-6">{{newsData.author}}</div>
        </div>
        <div class="row mar10">
          <div class="col-12">{{newsData.describe}}</div>
        </div>
        <div>{{newsData.content}}</div>
        <div class="row">
          <div class="col-12">
            <img :src="newsData.img" class="d-block w-100" alt />
          </div>
        </div>
        <div class="row justify-content-center mar20">
          <div class="block col-8">
            <span class="demonstration">音量</span>
            <el-slider v-model="form.speed" :step="10"></el-slider>
          </div>
          <div class="block col-8">
            <span class="demonstration">语速</span>
            <el-slider v-model="form.voice" :step="10"></el-slider>
          </div>
          <div class="block col-8">
            <el-radio v-model="form.voiceName" label="aisjiuxu">男声</el-radio>
            <el-radio v-model="form.voiceName" label="xiaoyan">女声</el-radio>
          </div>
        </div>
        <div class="row justify-content-center mar20">
          <el-button type="primary" icon="el-icon-video-play" @click="play">播放</el-button>
          <el-button type="primary" icon="el-icon-video-pause" @click="stop">暂停</el-button>
        </div>
        <div class="row justify-content-center mar20">
          <el-button type="primary" icon="el-icon-download" @click="downloadPCM">pcm</el-button>
          <el-button type="primary" icon="el-icon-download" @click="downloadWAV">wav</el-button>
        </div>
        <div class="textarea mar20">
          <el-input type="textarea" v-model="desc" placeholder="在这里可以随意评论"></el-input>
          <div class="button" @click="publish">
            <el-button>发表评论</el-button>
          </div>
        </div>
        <div class="card">
          <div class="card-body" v-for="(item, index) in newReply" :key="index">
            <span><a href="#">
              {{item.name}}</a>说:{{item.desc}}</span>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import ttsRecorder from '../common/js/TTSRecorder'
export default {
  data: function () {
    return {
      form: {
        speed: 50,
        voice: 50,
        pitch: 50,
        voiceName: 'xiaoyan',
        text: '',
        tte: 'UTF8'
      },
      newsData:
        {
          title: ''
        },
      desc: '',
      newReply: []
    }
  },
  async mounted () {
    await this.$axios.get('/getNews').then(res => {
      for (var i = 0; i < res.data.res.length; i++) {
        var aaa = new Blob([this._base64ToArrayBuffer(res.data.res[i].img)], { type: 'image/png' })
        res.data.res[i].img = URL.createObjectURL(aaa)
      }
      res.data.res.forEach((el) => {
        if (el._id === this.$route.params._id) { this.newsData = el }
      })
    })

    this.form.text = this.newsData.content
    this.getNewReply()
    this.$axios.post('/addNewCount', {
      data: {
        id: this.$route.params._id,
        count: this.$route.params.count
      }
    })
    if (sessionStorage.getItem('name')) {
      this.$axios.post('/addUserLike', {
        data: {
          name: sessionStorage.getItem('name'),
          type: this.newsData.type
        }
      })
    }
  },
  methods: {
    async  play () {
      await ttsRecorder.setParams({
        voiceName: this.form.voiceName,
        text: this.form.text,
        speed: this.form.speed,
        voice: this.form.voice
      })
      await ttsRecorder.start()
    },
    stop () {
      ttsRecorder.stop()
    },
    downloadWAV () {
      ttsRecorder.setParams({
        voiceName: this.form.voiceName,
        text: this.form.text,
        speed: this.form.speed,
        voice: this.form.voice
      })
      ttsRecorder.downloadWAV()
    },
    downloadPCM () {
      ttsRecorder.setParams({
        voiceName: this.form.voiceName,
        text: this.form.text,
        speed: this.form.speed,
        voice: this.form.voice
      })
      ttsRecorder.downloadPCM()
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
    publish () {
      if (!sessionStorage.getItem('name')) {
        this.$router.push('/login')
      } else {
        this.$axios.post('/publishNewReply', {
          data: {
            desc: this.desc,
            name: sessionStorage.getItem('name'),
            NewId: this.newsData._id
          }
        }).then(() => {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.desc = ''
          this.getNewReply()
        })
      }
    },
    getNewReply () {
      this.$axios.post('/getNewReply', {
        data: this.newsData._id
      }).then((res) => {
        this.newReply = res.data.res
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/font/iconfont.css";
.iconfont {
  font-size: 30px;
}
.new {
  margin-top: 20px;
}
.mar10 {
  margin: 10px 0 10px;
}
.mar20 {
  margin-top: 20px;
}
.button {
  float: right;
  margin-top: 8px;
  margin-bottom: 20px;
}
</style>
