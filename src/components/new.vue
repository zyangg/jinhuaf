<template>
  <div class="container new">
    <el-backtop></el-backtop>
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-10">
        <div class="row">
          <div class="col-12">
            <div class="title">{{newsData.title}}</div>
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="title-bar col-12">
            <span>发布:</span>
            <span>{{newsData.author}}</span>
            <span>发布时间:</span>
            {{newsData.date}} {{newsData.time}}
            <span></span>
          </div>
        </div>
        <div class="row mar10 justify-content-center" v-if="(newsData.class === 'cartoonNew')">
            <img :src="item" alt width="100%" height="100%" v-for="(item,index) in newsData.img" :key="index">
        </div>
       <div class="row mar10 justify-content-center" v-if="newsData.videoAudio && (newsData.class === 'video')">
                  <video
            :src="newsData.videoAudio"
            autoplay="autoplay"
            controls="controls"
            height="200px"
          />
        </div>
        <div class="row mar10 flex2" v-if="newsData.videoAudio && (newsData.class === 'audioNew')">
          <audio :src="newsData.videoAudio" controls="controls"></audio>
        </div>
        <div class="row mar10">
          <div class="col-12">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{newsData.describe}}
          </div>
        </div>
        <div class="row mar10">
          <div class="col-12">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{newsData.content.slice(0,newsData.content.length/2)}}
          </div>
        </div>
        <div class="row justify-content-center" style="margin-top:10px;margin-bottom:15px" v-if="!(newsData.class === 'cartoonNew')">
          <div class="col-8">
                  <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="(item,index) in newsData.img" :key="index">
              <img :src="item" alt width="100%" height="100%" />
            </el-carousel-item>
          </el-carousel>
          </div>
        </div>
        <div class="row mar10">
          <div class="col-12">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{newsData.content.slice(newsData.content.length/2)}}
          </div>
        </div>
        <div class="row mar10">
          <div class="col-12">来源：金华求新新闻网</div>
          <div class="col-12">审核：金华求新新闻网</div>
          <div class="col-12">未经同意，不得转载</div>
        </div>
        <div class="row mar10" style="margin-top:20px">
          <div class="col-12">
            <el-button icon="el-icon-setting" @click="isplay" circle></el-button>
            <el-button icon="el-icon-video-play" @click="play" circle></el-button>
            <el-button icon="el-icon-video-pause" @click="stop" circle></el-button>
            <el-button icon="el-icon-download" @click="download" circle></el-button>
          </div>
        </div>
        <div class="row mar10" v-show="isPlay">
          <div class="block col-8">
            <span class="demonstration">语速</span>
            <el-slider v-model="form.speed" :step="10"></el-slider>
          </div>
          <div class="block col-8">
            <span class="demonstration">音量</span>
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
          <div class="button" @click="start()">
            <el-button round>开始识别</el-button>
          </div>
          <div class="button" @click="stopIn()">
            <el-button round>结束识别</el-button>
          </div>
          <div class="button" @click="publish">
            <el-button round>发表评论</el-button>
          </div>
        </div>
        <div class="row" v-if="newReply.length>0" style="margin-top:30px;margin-bottom:20px">
          <div v-for="(item, index) in newReply" :key="index" class="col-12" style="margin-bottom:10px">
            <div class="flex">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
              &nbsp;&nbsp;<span>{{item.name}}</span>
            </div>
            <div style="padding-left:50px;" class="flex1"><span>{{item.desc}}</span>
            <span style="cursor:pointer" v-if="$store.state.isManager || item.name === $store.state.loginState" @click="delNewReply(item._id)"><i class="el-icon-delete"></i></span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ttsRecorder from '../common/js/TTSRecorder'
import IatRecorder from '../common/js/iatRecorder.js'
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
    await this.$axios.post('/findNewById', {
      data: {
        id: this.$route.params._id
      }
    }).then(res => {
      for (var i = 0; i < res.data.res.img.length; i++) {
        var aaa = new Blob([this._base64ToArrayBuffer(res.data.res.img[i])], {
          type: 'image/png'
        })
        res.data.res.img[i] = URL.createObjectURL(aaa)
      }
      this.newsData = res.data.res
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
    delNewReply (id) {
      this.$axios
        .post('/delNewReply', {
          data: id })
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.desc = ''
          this.getNewReply()
        })
    },
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
      console.log('aaaaaaaaaa', this.form.text)
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
      this.$message({
        message: '正在合成',
        duration: 5000
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
      this.$message({
        message: '正在合成',
        duration: 5000
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
            IatRecorder.setResultText({
              resultText: ''
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
    },
    start () {
      IatRecorder.start()
      setInterval(() => {
        if (IatRecorder.resultText) {
          this.desc = IatRecorder.resultText
        }
      }, 2000)
    },
    stopIn () {
      IatRecorder.stop()
    },
    async transText (url) {
      await this.$axios.post('/downLoadUrl', {
        data: url
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/font/iconfont.css";
.flex {
  display: flex;
  align-items: center;
}
.flex2 {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.flex1 {
  display: flex;
  justify-content: space-between;
}
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
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
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
/deep/ .el-icon-delete:before {
  font-size: 20px;
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
