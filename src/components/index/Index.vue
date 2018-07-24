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
    </div>
</template>

<script>
  import API from "../../api/api"
    export default {
      name: "Index",
      data(){
        return {
          sysInfo: ""
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
        }
      },
      created(){
        this.initSystemInfo();
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