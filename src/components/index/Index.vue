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

    <div class="recommend-container">
      <div class="recommend-operation">
        <el-button @click="addNewRecommend" type="primary">添加</el-button>
        <el-button @click="showAllRecommend" type="primary">显示全部推荐</el-button>
        <el-button @click="showRecommend" type="primary">显示首页的推荐</el-button>
      </div>
      <div :class="{deletedRec:recommend.recommendStatus==='DELETE'}" class="recommend-wrapper" v-for="(recommend,index) in recommends" :key="recommend.id">
        <div style="float: right">
          <el-button type="primary" icon="el-icon-edit" circle
                     @click="handleEditRecommend(recommend, index)"></el-button>
          <el-button style="float: right" type="danger" icon="el-icon-delete" circle
                     :disabled="recommend.recommendStatus==='DELETE'"
                     @click="handleDeleteRecommend(recommend.id,index)">
          </el-button>
        </div>
        <img style="width: 320px;height: 180px" :src="recommend.imageUrl"/>
        <p>id:{{recommend.id}}</p>
        <p>title:{{recommend.title}}</p>
        <p>linkUrl:{{recommend.linkUrl}}</p>
        <p>创建时间：{{recommend.createTime}}</p>
        <p>修改时间：{{recommend.modifyTime}}</p>
        <p>状态：{{recommend.recommendStatus}}</p>
        <p>publisherId:{{recommend.publisherId}}</p>
        <p>在首页展示：{{recommend.showIndex}}</p>
      </div>

      <div v-if="page" class="pagination-container">
        <el-pagination @current-change="handleCurrentChange"
                       :current-page.sync="page.pageNumber"
                       layout="total, sizes, prev, pager, next, jumper" :total="page.totalSize">
        </el-pagination>
      </div>

      <el-dialog :before-close="clearTempRecommend" title="修改推荐" :visible.sync="showAddRecommend">
        <el-form class="small-space" :model="tmpRecommend" label-position="left" label-width="70px" style='margin-left:50px;'>

          <el-form-item label="标题">
            <el-input v-model="tmpRecommend.title"></el-input>
          </el-form-item>

          <el-form-item label="链接">
            <el-input v-model="tmpRecommend.linkUrl"></el-input>
          </el-form-item>

          <el-form-item label="图片链接">
            <el-input v-model="tmpRecommend.imageUrl"></el-input>
            <img style="width: 320px; height: 180px" v-show="tmpRecommend.imageUrl" :src="tmpRecommend.imageUrl"/>
          </el-form-item>

          <el-form-item label="是否显示">
            <el-switch
              v-model="tmpRecommend.showIndex"
              active-color="#3a86ef"
              inactive-color="#777">
            </el-switch>
          </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddRecommend">取 消</el-button>

          <el-button type="primary" @click="handleAddRecommend">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import API from "../../api/api"

  export default {
    name: "Index",
    data() {
      return {
        sysInfo: "",
        edit: false,
        wText: "",
        tmpText: "",
        recommends: "",
        page: "",
        sort: 1,
        tmpRecommend: {
          id: "",
          title: "",
          linkUrl: "",
          imageUrl: "",
          showIndex: ""
        },
        showAddRecommend: false
      }
    },
    methods: {
      async initSystemInfo() {
        let res = await API.getSystemMainInfo();
        let rd = res.data;
        console.log("systemInfo:", rd.data);
        this.sysInfo = rd.data;
      },
      getOnlineUsers() {
        console.log("get online users.");
        this.$router.push({name: 'onlineuser'});
      },
      getTodayOnlineUsers() {
        console.log("get today online users.");
        this.$router.push({name: 'onlineuser', params: {today: 'today'}});
      },
      async initWellcomeText() {
        let res = await API.getWellcome();
        let rd = res.data;
        if (rd.code === 0) {
          this.wText = rd.data;
        }
        else {
          console.log("get wellcomeText err.");
        }
      },
      async updateWellcomeText(text) {
        if (text === "") {
          this.$message({
            message: "内容为空",
            type: "error"
          });
          return
        }
        let res = await API.setWellcome({sentence: text});
        let rd = res.data;
        console.log("rd:", rd.data);
        if (rd.code === 0) {
          this.wText = text;
          this.edit = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      },
      handleEdit() {
        this.edit = true;
        this.tmpText = this.wText;
      },
      handleSave() {
        this.updateWellcomeText(this.tmpText);
      },
      handleDiscard() {
        this.edit = false;
      },
      async initRecommend() {
        let res = await API.getRecommends(1, 10, 1);
        let rd = res.data;
        if (rd.code === 0) {
          this.recommends = rd.data.irs;
          this.page = rd.data.page;
        }
      },
      async handleCurrentChange(val) {
        let res = await API.getRecommends(val, 10, this.sort);
        let rd = res.data;
        if (rd.code === 0) {
          this.recommends = rd.data.irs;
          this.page = rd.data.page;
        }
        else {
          console.log("get recommends err.");
        }
      },
      async handleDeleteRecommend(id, index) {
        this.$confirm("删除推荐：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            console.log(instance);
            if (action === "confirm") {
              let res = await API.deleteRecommend(id);
              let rd = res.data;
              if (rd.code === 0) {
                this.recommends.splice(index, 1);
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: rd.msg,
                  type: "error"
                });
              }
            }
          }
        });
      },
      handleEditRecommend(recommend, index) {
        if(index){
          this.tmpRecommend.id = recommend.id;
        }
        console.log("edit recommend:", recommend);
        this.showAddRecommend = true;
        this.tmpRecommend.title = recommend.title;
        this.tmpRecommend.linkUrl = recommend.linkUrl;
        this.tmpRecommend.imageUrl = recommend.imageUrl;
        this.tmpRecommend.showIndex = recommend.showIndex;
      },
      async handleAddRecommend(){
        let res;
        if(this.tmpRecommend.id){
          res = await API.updateRecommend(this.tmpRecommend.id,{
            title: this.tmpRecommend.title,
            linkUrl: this.tmpRecommend.linkUrl,
            imageUrl: this.tmpRecommend.imageUrl,
            showIndex: this.tmpRecommend.showIndex?1:0
          });
        }
        else {
          res = await API.addRecommend({
            title: this.tmpRecommend.title,
            linkUrl: this.tmpRecommend.linkUrl,
            imageUrl: this.tmpRecommend.imageUrl,
            showIndex: this.tmpRecommend.showIndex?1:0
          });
        }
        let rd = res.data;
        if(rd.code === 0){
          this.showAddRecommend = false;
          this.tmpRecommend.title = "";
          this.tmpRecommend.linkUrl = "";
          this.tmpRecommend.imageUrl = "";
          this.tmpRecommend.showIndex = "";
          this.tmpRecommend.id = "";
          this.initRecommend();
        }
      },
      cancelAddRecommend(){
        this.tmpRecommend.title = "";
        this.tmpRecommend.linkUrl = "";
        this.tmpRecommend.imageUrl = "";
        this.tmpRecommend.showIndex = "";
        this.tmpRecommend.id = "";
        this.showAddRecommend = false;
      },
      clearTempRecommend(done){
        this.tmpRecommend.title = "";
        this.tmpRecommend.linkUrl = "";
        this.tmpRecommend.imageUrl = "";
        this.tmpRecommend.showIndex = "";
        this.tmpRecommend.id = "";
        done();
      },
      addNewRecommend(){
        this.showAddRecommend = true;
      },
      async showAllRecommend(){
        let res = await API.getRecommends(1,10,2);
        let rd = res.data;
        if(rd.code === 0){
          this.sort = 2;
          this.recommends = rd.data.irs;
          this.page = rd.data.page;
        }
      },
      async showRecommend(){
        this.sort = 1;
        this.initRecommend();
      }
    },
    created() {
      this.initSystemInfo();
      this.initWellcomeText();
      this.initRecommend();
    }
  }
</script>

<style scoped>
  .deletedRec {
    background-color: #610700;
  }
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

  .box-card .text a:hover {
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

  .recommend-container {
    margin-top: 30px;
  }

  .recommend-wrapper {
    display: inline-block;
    width: 400px;
    height: 560px;
    border: 1px solid white;
    margin: 10px;
    padding-left: 10px;
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