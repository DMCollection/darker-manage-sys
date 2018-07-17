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
          <el-upload
                  class="avatar-uploader"
                  :action="GLOBAL.uploadURL"
                  name="image"
                  :headers="GLOBAL.uploadHEADERS"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
            <img class="upload-img" v-if="imageUrl" :src="imageUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
        imageUrl: ""
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        console.log("handleAvatarSucc invoked!");
        console.log(res);
        console.log(file);
        let link = res.data.link;
        link = link.substring(link.lastIndexOf('/'));
        console.log("link:",link);
        this.temp.thumb = this.GLOBAL.imgURL+link;
        console.log(this.temp.thumb);
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        console.log("file ", file);
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error("上传头像图片只能是 JPG 格式!");
        // }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
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
    width: 225px;
    height: 300px;
  }
</style>