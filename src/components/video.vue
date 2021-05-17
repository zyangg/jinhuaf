<template>
  <div class="container video">
    <div class="row">
      <div class="col-sm-6 col-12 col-md-4 col-lg-4" style="margin-top:20px;margin-bottom:20px;"
       v-for="(item,index) in newData"
        :key="index">
        <el-card :body-style="{ padding: '0px' }">
          <video
            :src="item.videoAudio"
            controls="controls"
            width="100%"
            height="200px"
          />
          <div style="padding: 14px;">
            <div class="ellipics">{{item.title}}</div>
            <div class="bottom clearfix">
              <time class="time">{{ item.date }}{{item.time}}</time>
              <el-button type="text" class="button" @click="$router.push({name: 'new',
                params: {_id: item._id, count: item.count}})">查看新闻</el-button>
            </div>
          </div>
        </el-card>
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
  data () {
    return {
      size: 5,
      total: 0,
      currentPage: 1,
      newData: []
    }
  },
  mounted () {
    this.getEnglishNew()
  },
  methods: {
    getEnglishNew () {
      this.$axios.post('/getNewByClass', {
        data: {
          size: this.size,
          currentPage: this.currentPage,
          classs: 'video'
        }
      }).then((res) => {
        for (var i = 0; i < res.data.res.res.length; i++) {
          var aaa = new Blob([this._base64ToArrayBuffer(res.data.res.res[i].img[0])], { type: 'image/png' })
          res.data.res.res[i].img[0] = URL.createObjectURL(aaa)
        }
        this.total = res.data.res.total
        this.newData = res.data.res.res
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.getEnglishNew()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getEnglishNew()
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
.video {
    text-align: left;
}
.time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
  .ellipics {
      overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  }
</style>
