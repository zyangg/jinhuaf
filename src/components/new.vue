<template>
  <div class="container new">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-10">
        <div class="row">
          <div class="col-12">
            <div class="title">{{newsData.title}}</div>
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="title-bar col-12">
            <span>发布:</span><span>{{newsData.author}}</span>
            <span>发布时间:</span>{{newsData.date}} {{newsData.time}}<span></span>
          </div>
        </div>
        <div class="row mar10">
          <div class="col-12">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{newsData.describe}}</div>
        </div>
        <div class="row mar10">
          <div class="col-12">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{newsData.content.slice(0,newsData.content.length/2)}}</div>
          </div>
        <div class="row justify-content-center" style="margin-top:10px;margin-bottom:15px">
          <div class="col-8">
            <img :src="newsData.img" class="d-block w-100" alt />
          </div>
        </div>
             <div class="row mar10">
          <div class="col-12">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{newsData.content.slice(newsData.content.length/2)}}</div>
          </div>
          <div class="row mar10" style="color:black;font-weight: 700;">
            <div class="col-12">来源：金华求新新闻网</div>
            <div class="col-12">审核：金华求新新闻网</div>
            <div class="col-12">未经审核，不得转载</div>
          </div>
        <div class="row mar10" style="margin-top:20px">
          <el-button icon="el-icon-setting" @click="isplay" circle></el-button>
          <el-button icon="el-icon-video-play" @click="play" circle></el-button>
          <el-button icon="el-icon-video-pause" @click="stop" circle></el-button>
          <el-button icon="el-icon-download" @click="download" circle></el-button>
        </div>
        <div class="row mar10" v-show="isPlay">
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
          <div class="block col-8">
            <el-radio v-model="format" label="pcm">pcm</el-radio>
            <el-radio v-model="format" label="wav">wav</el-radio>
          </div>
        </div>
        <div class="textarea mar10">
          <el-input type="textarea" v-model="desc" placeholder="在这里可以随意评论" maxlength="50" show-word-limit></el-input>
          <div class="button" @click="publish">
            <el-button round>发表评论</el-button>
          </div>
        </div>
        <div class="row" v-if="newReply.length>0" style="margin-top:30px;margin-bottom:20px">
          <div v-for="(item, index) in newReply" :key="index">
            <span>
              <el-button type="text">{{item.name}}</el-button>
              说:{{item.desc}}
            </span>
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
      format: 'pcm',
      isPlay: false,
      form: {
        speed: 50,
        voice: 50,
        pitch: 50,
        voiceName: 'xiaoyan',
        text: '',
        tte: 'UTF8'
      },
      newsData: {
        title: ''
      },
      desc: '',
      newReply: []
    }
  },
  async mounted () {
    await this.$axios.get('/getNews').then(res => {
      for (var i = 0; i < res.data.res.length; i++) {
        var aaa = new Blob([this._base64ToArrayBuffer(res.data.res[i].img)], {
          type: 'image/png'
        })
        res.data.res[i].img = URL.createObjectURL(aaa)
      }
      res.data.res.forEach(el => {
        if (el._id === this.$route.params._id) {
          this.newsData = el
        }
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
    isplay () {
      this.isPlay = !this.isPlay
    },
    async play () {
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
    download () {
      if (this.format === 'wav') {
        this.downloadWAV()
      }
      if (this.format === 'pcm') {
        this.downloadPCM()
      }
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
        this.$axios
          .post('/publishNewReply', {
            data: {
              desc: this.desc,
              name: sessionStorage.getItem('name'),
              NewId: this.newsData._id
            }
          })
          .then(() => {
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
      this.$axios
        .post('/getNewReply', {
          data: this.newsData._id
        })
        .then(res => {
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
.title {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #336699;
}
.title-bar {
    color: #777;
    background: #F5F5F5;
    border-bottom: 1px solid #DDD;
    padding: 5px 0;
    text-align: center;
    font-size: 13px;
    span {
      margin-right: 8px;
    }
}
.new {
  text-align: left;
  margin-top: 20px;
  line-height: 1.8;
}
.mar10 {
  margin: 10px 0 10px;
}
.mar20 {
  margin-top: 20px;
  margin-bottom: 50px;
}
.button {
  float: right;
  margin-top: 8px;
}
/deep/ .el-icon-setting:before {
    font-size: 26px;
}
/deep/ .el-icon-video-play:before {
    font-size: 26px;
}
/deep/ .el-icon-video-pause:before {
    font-size: 26px;
}
/deep/ .el-icon-download:before {
    font-size: 26px;
}
/deep/ .el-button.is-circle {
    border: 0;
}
/deep/ .el-slider__runway {
    width: 44%;
}
</style>
