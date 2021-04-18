<template>
  <div class="publishArticle">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="新闻标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="新闻作者">
        <el-col>
          <el-input v-model="form.author"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="新闻类型">
        <el-select v-model="form.type" placeholder="请选择新闻类型">
          <el-option label="娱乐" value="yule"></el-option>
          <el-option label="美食" value="meishi"></el-option>
          <el-option label="社会" value="shehui"></el-option>
          <el-option label="财经" value="caijing"></el-option>
          <el-option label="时政" value="shizheng"></el-option>
          <el-option label="科技" value="keji"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻简介">
        <el-input v-model="form.describe"></el-input>
      </el-form-item>
      <el-form-item label="新闻图片">
        <el-upload
          ref="upload"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="change"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="form.dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
            <el-form-item label="发布时间">
        <el-col :span="11">
          <el-date-picker type="date"
          placeholder="选择日期"
          v-model="form.date"
           value-format="yyyy-MM-dd"
          style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间"
          v-model="form.time"
          value-format="HH:mm:ss"
          style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="新闻内容">
        <el-input type="textarea" v-model="form.content" :rows="20"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即发布</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        title: '',
        describe: '',
        content: '',
        dialogImageUrl: '',
        date: '',
        time: '',
        author: '',
        type: ''
      },
      dialogVisible: false
    }
  },
  methods: {
    async onSubmit () {
      this.$axios
        .post('/publish', {
          data: this.form
        })
        .then(() => {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        })
    },
    handleRemove (file, fileList) {
      console.log('remove', file, fileList)
    },
    handlePictureCardPreview (file) {
      console.log('file', file, file.url)
      this.form.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async change (file) {
      var that = this
      console.log('change', file, typeof file.raw)
      var reader = new FileReader()
      reader.addEventListener('loadend', function (e) {
        // console.log('ee', that.transformArrayBufferToBase64(e.target.result), e.target.result)
        that.form.dialogImageUrl = that.transformArrayBufferToBase64(
          e.target.result
        )
        // reader.result 包含被转化为类型数组 typed array 的 blob
        console.log(
          'result',
          that._base64ToArrayBuffer(
            that.transformArrayBufferToBase64(e.target.result)
          ),
          e.target.result
        )
        var aaa = new Blob([e.target.result], { type: 'image/png' })
        console.log('aaaa', URL.createObjectURL(aaa))
      })

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
    }
  }
}
</script>
<style lang="less" scoped>
  .publishArticle {
    text-align: left;
  }
</style>
