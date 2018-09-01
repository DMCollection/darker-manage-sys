<template>
  <div class="api-test">
    <el-collapse @change="handleChange">
      <el-collapse-item title="replies" name="1">
        <div class="rpy-json">
          <div class="rpy-input">
            <span>episode id</span>
            <el-input size="small" v-model="epId" style="width:100px"></el-input>
          </div>
          <div class="rpy-input">
            <span>page number</span>
            <el-input size="small" v-model="pn" style="width: 100px;"></el-input>
          </div>

          <el-button type="primary" @click="getReplyJson">获取replies</el-button>

          <div v-if="jsonResult" class="content">
            <tree-view :data="jsonResult" :options="options">
            </tree-view>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="img-api">
      <el-upload
              class="avatar-uploader"
              action="https://api.imgur.com/3/image"
              :headers="GLOBAL.uploadHEADERS"
              name="image"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
        <img class="upload-img" v-show="imgurl" :src="imgurl">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <tree-view :data="imgResult">
      </tree-view>
    </div>
    <div style="margin-top: 100px;">
      <el-input v-model="myURL"></el-input>
      <el-button @click="sendRequest">发送</el-button>
      <tree-view :data="myResult"></tree-view>
      <!--<div class="log-content">-->
        <!--<div v-for="(log,index) in splitRes">-->
          <!--<p style="width: 800px">{{log}}</p>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import API from "../../api/api"
  export default {
    name: "ApiTest",
    data(){
      return {
        epId: 15,
        pn: 1,
        jsonResult:"",
        options:{
          maxDepth: 2,
          rootObjectKey: "replies",
          modifiable: false
        },
        imgurl: "",
        imgResult: "",
        myURL: "",
        myResult: "",
        splitRes: ""
      }
    },
    computed:{
      getLogText(){
        return this.myResult?this.myResult.substring(0,2000).replace(/\n/g, "<br>"):"no result";
      }
    },
    methods:{
      async getReplyJson(){
        if(!this.epId || !this.pn){
          this.$message({
            message: "参数有误",
            type: "error"
          });
          return ;
        }
        let res = await API.getReplies(this.epId,this.pn);
        let rd = res.data;
        console.log(rd);
        this.jsonResult = rd;
      },
      handleChange(val) {
        console.log(val);
      },
      handleAvatarSuccess(res, file) {
        console.log("handleAvatarSucc invoked!");
        console.log(res);
        console.log(file);
        this.imgResult = res.data;
        this.imgurl = res.data.link;
        console.log(this.imgResult);
      },
      beforeAvatarUpload(file) {
        console.log("file ", file);
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 4;

        // if (!isJPG) {
        //   this.$message.error("上传头像图片只能是 JPG 格式!");
        // }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 4MB!");
        }
        return isLt2M;
      },
      async sendRequest() {
        if(this.myURL === '')
          return
        let res = await API.apiRequest(this.myURL);
        let rd = res.data;
        this.myResult = rd;
      }
    }
  }
</script>

<style scoped>
  .upload-img {
    max-width: 200px;
    max-height: 200px;
  }
</style>
<style>
  .rpy-json {
    margin-bottom: 20px;
    color: #20968b;
  }
  .rpy-json .content {
    margin-top: 20px;
    font-size: 16px;
  }

  .rpy-input {
    margin-bottom: 10px;
  }

  .rpy-input span {
    display: inline-block;
    margin-right: 20px;
  }

  .el-collapse .el-collapse-item div .el-collapse-item__header {
    color: inherit;
    background-color: inherit;
  }

  .el-collapse .el-collapse-item .el-collapse-item__wrap {
    background-color: inherit;
  }
</style>