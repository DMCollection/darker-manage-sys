<template>
    <div class="index">
      <div class="main-info">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>在线用户</span>
          </div>
          <div class="text item">
            <a @click="getOnlineUsers" href="javascript:void(0);">{{sysInfo.authOnline}}</a>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>在线游客</span>
          </div>
          <div class="text item">
            {{sysInfo.anonOnline}}
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>当前在线人数</span>
          </div>
          <div class="text item">
            {{sysInfo.totalOnline}}
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日注册用户</span>
          </div>
          <div class="text item">
            {{sysInfo.newUsers}}
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户总数</span>
          </div>
          <div class="text item">
            {{sysInfo.totalUsers}}
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>游客总数</span>
          </div>
          <div class="text item">
            {{sysInfo.totalVisitors }}
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日在线用户</span>
          </div>
          <div class="text item">
            <a @click="getTodayOnlineUsers" href="javascript:void(0);">{{sysInfo.maxAuthOnline}}</a>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日评论</span>
          </div>
          <div class="text item">
            {{sysInfo.newReplies}}
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日在线游客</span>
          </div>
          <div class="text item">
            {{sysInfo.maxAnonOnline}}
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>访问量</span>
          </div>
          <div class="text item">
            {{sysInfo.visit}}
          </div>
        </el-card>
      </div>
      <div class="wellcome-container">
        <div class="wellc-title">当前欢迎页内容</div>
        <div class="w-content">
          <p v-if="!edit">{{wText}}</p>
          <p v-else>
            <el-input style="width: 400px" v-model="tmpText"></el-input>
          </p>
          <div v-if="!edit" @click="handleEdit" class="edit-wellcome">
            <i class="el-icon-edit edit-icon"></i>
          </div>
          <div v-else class="edit-wellcome">
            <i style="margin-right: 5px" @click="handleSave" class="el-icon-success save-icon"></i>
            <i @click="handleDiscard" class="el-icon-error discard-icon"></i>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import API from "../../api/api"
    export default {
      name: "Index",
      data(){
        return {
          sysInfo: "",
          edit: false,
          wText: "",
          tmpText: ""
        }
      },
      methods:{
        async initSystemInfo(){
          let res = await API.getSystemMainInfo();
          let rd = res.data;
          console.log("systemInfo:",rd.data);
          this.sysInfo = rd.data;
        },
        getOnlineUsers(){
          console.log("get online users.");
          this.$router.push({name:'onlineuser'});
        },
        getTodayOnlineUsers(){
          console.log("get today online users.");
          this.$router.push({name:'onlineuser',params:{today:'today'}});
        },
        async initWellcomeText(){
          let res = await API.getWellcome();
          let rd = res.data;
          if(rd.code === 0){
            this.wText = rd.data;
          }
          else {
            console.log("get wellcomeText err.");
          }
        },
        async updateWellcomeText(text){
          if(text === ""){
            this.$message({
              message: "内容为空",
              type: "error"
            });
            return
          }
          let res = await API.setWellcome({sentence:text});
          let rd = res.data;
          console.log("rd:",rd.data);
          if(rd.code === 0){
            this.wText = text;
            this.edit = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }
        },
        handleEdit(){
          this.edit = true;
          this.tmpText = this.wText;
        },
        handleSave(){
          this.updateWellcomeText(this.tmpText);
        },
        handleDiscard(){
          this.edit = false;
        }
      },
      created(){
        this.initSystemInfo();
        this.initWellcomeText();
      }
    }
</script>

<style scoped>
  .text {
    font-size: 24px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 250px;
    height: 150px;
    margin: 10px;
    display: inline-block;
  }

  .box-card .text a {
    text-decoration: none;
    color: inherit;
  }

  .box-card .text a:hover{
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .wellcome-container {
    font-size: 20px;
  }
  .wellcome-container .wellc-title {
    color: #d8d8d8;
  }
  .edit-wellcome {
    display: inline-block;
    margin-left: 20px;
  }
  .w-content p {
    display: inline-block;
  }
</style>
<style>
  .main-info .el-card {
    border: none;
    color: #ffffff;
    background-color: #000;
    border-radius: 3%;
  }
  .main-info .el-card .el-card__header {
    border-bottom: 1px solid #0d170ca8;
  }
</style>