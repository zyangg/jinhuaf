<template>
  <div class="container">
    <div class="row justify-content-center" style="margin-top:10px">
      <div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="帖子名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="发帖人">
            <el-input v-model="form.author"></el-input>
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
              <el-time-picker placeholder="选择时间"
               v-model="form.time"
               value-format="HH:mm:ss"
               style="width: 100%;"></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="选择图片">
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
              <img width="100%" :src="form.dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item label="帖子内容">
            <el-input type="textarea" v-model="form.desc" :rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即发布</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        name: '',
        author: '',
        date: '',
        time: '',
        desc: '',
        reply: 0,
        like: 0,
        dialogImageUrl: ''
      },
      dialogVisible: false
    }
  },
  methods: {
    onSubmit () {
      console.log('form', this.form)

      this.$axios
        .post('/publishPost', {
          data: this.form
        })
        .then(() => {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        })
    },
    cancel () {
      this.form.name = ''
      this.form.author = ''
      this.form.date = ''
      this.form.time = ''
      this.form.desc = ''
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
      var reader = new FileReader()
      reader.addEventListener('loadend', function (e) {
        that.form.dialogImageUrl = that.transformArrayBufferToBase64(
          e.target.result
        )
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
.container {
  text-align: left;
}
</style>
