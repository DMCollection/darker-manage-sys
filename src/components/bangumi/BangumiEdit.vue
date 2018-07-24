<template>
  <div class="bangumi-edit">
    <div class="be-form">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px">
        <el-form-item v-show="temp.bangumiId!=''" label="id">
          <el-input v-model="temp.bangumiId"></el-input>
        </el-form-item>

        <el-form-item label="番剧名称">
          <el-input v-model="temp.bangumiName"></el-input>
        </el-form-item>

        <el-form-item label="总集数">
          <el-input v-model="temp.episodeTotal"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <div class="upload-container">
            <img @click="toggleShow" class="upload-img" v-if="imageUrl" :src="imageUrl">
            <i v-else @click="toggleShow" class="el-icon-plus avatar-uploader-icon"></i>
            <my-upload field="image"
                       @crop-success="cropSuccess"
                       @crop-upload-success="cropUploadSuccess"
                       @crop-upload-fail="cropUploadFail"
                       v-model="show"
                       :width="960"
                       :height="540"
                       :noCircle="true"
                       :url="GLOBAL.uploadURL"
                       :headers="GLOBAL.uploadHEADERS"
                       img-format="jpg"
            ></my-upload>
          </div>
        </el-form-item>
      </el-form>
      <el-button @click="handleAddBangumi" type="primary">添加</el-button>
    </div>
    <div>

    </div>

  </div>
</template>

<script>
  import API from "../../api/api"
  import 'babel-polyfill';
  import myUpload from 'vue-image-crop-upload';
  export default {
    name: "BangumiEdit",
    data() {
      return {
        temp: {
          bangumiId: "",
          bangumiName: "",
          thumb: "",
          episodeTotal: ""
        },
        imageUrl: "",
        show: false
      }
    },
    components:{
      "my-upload": myUpload
    },
    methods: {
      toggleShow() {
        this.show = !this.show;
      },
      /**
       * crop success
       *
       * [param] imgDataUrl
       * [param] field
       */
      cropSuccess(imgDataUrl, field) {
        console.log('-------- crop success --------');
      },
      /**
       * upload success
       *
       * [param] jsonData   服务器返回数据，已进行json转码
       * [param] field
       */
      cropUploadSuccess(res, field) {
        console.log('-------- upload success --------');
        console.log(res);
        let link = res.data.link;
        link = link.substring(link.lastIndexOf('/'));
        console.log("link:",link);
        this.temp.thumb = this.GLOBAL.imgURL+link;
        this.imageUrl = this.GLOBAL.imgURL+link;
      },
      /**
       * upload fail
       *
       * [param] status    server api return error status, like 500
       * [param] field
       */
      cropUploadFail(status, field) {
        console.log('-------- upload fail --------');
        console.log(status);
        console.log('field: ' + field);
      },
      async handleAddBangumi() {
        console.log("handle add bangumi!");
        let res;
        console.log("temp:", this.temp);
        if (this.temp.bangumiId === "") {
          console.log("add bangumi...");
          res = await API.addBangumi(this.temp);
        } else {
          console.log("edit bangumi...");
          res = await API.editBangumi(this.temp.bangumiId, this.temp);
        }
        const rd = res.data;
        console.log("addBangumi res:", rd);
        if (rd.code === 0) {
          console.log("add succeeded!");
          this.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          this.temp.bangumiName = "";
          this.temp.episodeTotal = "";
          this.temp.thumb = "";
          this.temp.bangumiId = "";
          this.imageUrl = "";
        } else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      }
    }
  }
</script>

<style scoped>
  .upload-img {
    width: 320px;
    height: 180px;
  }
</style>