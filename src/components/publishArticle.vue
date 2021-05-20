<template>
  <div class="publishArticle">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="新闻种类">
        <el-select v-model="form.class">
          <el-option
            v-for="(item, index) in classOptions"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
          <el-form-item label="新闻子类型" v-if="form.class === 'cartoonNew'">
        <el-select v-model="form.cartoonType">
          <el-option
            v-for="(item, index) in cartoonType"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="新闻作者">
        <el-col>
          <el-input v-model="form.author"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="新闻类型" v-if="form.class === 'font'">
        <el-select v-model="form.type" placeholder="请选择新闻类型">
          <el-option label="娱乐" value="yule"></el-option>
          <el-option label="美食" value="meishi"></el-option>
          <el-option label="社会" value="shehui"></el-option>
          <el-option label="财经" value="caijing"></el-option>
          <el-option label="时政" value="shizheng"></el-option>
          <el-option label="科技" value="keji"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻简介" v-if="!(form.class === 'cartoonNew')">
        <el-input v-model="form.describe"></el-input>
      </el-form-item>
      <el-form-item label="新闻图片">
        <el-upload
          ref="upload"
          action="#"
          multiple
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="change"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="imgSrc" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="新闻音视频" v-if="form.class === 'video' || form.class === 'audioNew'">
        <el-upload
          action=""
          ref="uploads"
          :multiple="true"
          :file-list="fileLists"
          :limit="limit"
          accept="video/mp4,audio/mp3"
          :http-request="fnUploadRequest"
          :on-remove="handleRemoveV"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">可以上传音频和视频</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.date"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker
            placeholder="选择时间"
            v-model="form.time"
            value-format="HH:mm:ss"
            style="width: 100%;"
          ></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="新闻内容">
        <el-input
          type="textarea"
          v-model="form.content"
          :rows="20"
          maxlength="2000"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即发布</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import OSS from 'ali-oss'
export default {
  data () {
    return {
      form: {
        title: '',
        describe: '',
        cartoonType: '',
        content: '',
        dialogImageUrl: [],
        videoAudio: '',
        date: '',
        time: '',
        author: '',
        type: '',
        class: 'font'
      },
      dialogVisible: false,
      imgSrc: '',
      classOptions: [
        {
          label: '文字图片新闻',
          value: 'font'
        },
        {
          label: '英文新闻',
          value: 'english'
        },
        {
          label: '视频新闻',
          value: 'video'
        },
        {
          label: '漫评金华',
          value: 'cartoonNew'
        },
        {
          label: '音频新闻',
          value: 'audioNew'
        }
      ],
      cartoonType: [
        {
          label: '长图',
          value: 'piiic'
        },
        {
          label: '漫画',
          value: 'cartoon'
        },
        {
          label: '海报',
          value: 'bill'
        }
      ],
      fileLists: [],
      limit: 5,
      ossClient: {}
    }
  },
  mounted () {
    this.getPermission()
  },
  methods: {
    async onSubmit () {
      this.form.content = this.form.content.trim()
      this.form.describe = this.form.describe.trim()
      this.$axios
        .post('/publish', {
          data: this.form
        })
        .then(() => {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.form.dialogImageUrl = []
        })
    },
    handleRemove (file, fileList) {
      console.log('remove', file, fileList)
    },
    handlePictureCardPreview (file) {
      this.imgSrc = file.url
      console.log('aaaaaa', this.imgSrc)
      this.dialogVisible = true
    },
    async change (file, filelist) {
      var that = this
      var reader = new FileReader()
      reader.addEventListener('loadend', function (e) {
        that.form.dialogImageUrl.push(
          that.transformArrayBufferToBase64(e.target.result)
        )
        // reader.result 包含被转化为类型数组 typed array 的 blob
        // console.log(
        //   'result',
        //   that._base64ToArrayBuffer(
        //     that.transformArrayBufferToBase64(e.target.result)
        //   ),
        //   e.target.result
        // )
        // var aaa = new Blob([e.target.result], { type: 'image/png' })
        // console.log('aaaa', URL.createObjectURL(aaa))
      })
      console.log('aa', that.form.dialogImageUrl)
      reader.readAsArrayBuffer(file.raw)
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
    getPermission () {
      this.$axios('/getOssPermission').then(res => {
        this.ossClient = new OSS({
          accessKeyId: res.data.res.credentials.AccessKeyId,
          accessKeySecret: res.data.res.credentials.AccessKeySecret,
          stsToken: res.data.res.credentials.SecurityToken,
          bucket: 'vehicle2-rent',
          region: 'oss-cn-hangzhou'
        })
      })
    },
    async fnUploadRequest (options) {
      let file = options.file
      let fileName = file.name.substr(0, file.name.lastIndexOf('.'))
      let date = new Date().getTime()
      let fileNames = `${date}_${fileName}`
      await this.ossClient.put(fileNames, file).then(res => {
        this.form.videoAudio = res.url
        // this.fileLists.push({
        //   name: res.name,
        //   url: res.url
        // })
      })
      console.log('aaaaaa', this.form, this.fileLists)
    },
    handleRemoveV (file, fileLists) {
      console.log('删除')
      console.log(file, fileLists)
      //   let fileName = file.name.substr(0, file.name.lastIndexOf('.'))
      //   let ind
      //   this.imgUrlList.map((item, index) => {
      //     if (item.name.lastIndexOf(fileName)) {
      //       ind = index
      //     }
      //   })
      //   console.log(ind)
      //   console.log(this.imgUrlList)
    }
  }
}
</script>
<style lang="less" scoped>
.publishArticle {
  text-align: left;
}
</style>
