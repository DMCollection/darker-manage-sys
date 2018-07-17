<template>
  <div class="upb-card">
    <div class="box-card">
      <div class="card-header clearfix">
        <span style="display: inline-block; padding: 3px 5px;color:#d2cece">{{bangumi.bn}}</span>
        <span class="pb-status" :class="{pending:isPending,failed: isFailed,success: isSuccess,nperfect: isNotPerfect}">
          {{bangumi.pbs_name}}
        </span>
      </div>
      <div class="card-body">
        <div class="bangumi-info">
          <div class="thumb-wrapper">
            <el-upload
                    class="avatar-uploader"
                    :action="GLOBAL.uploadURL"
                    :show-file-list="false"
                    name="image"
                    :headers="GLOBAL.uploadHEADERS"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
              <img v-if="bangumi.thumb" class="thumb" :src="bangumi.thumb"/>
              <i v-else class="el-icon-plus avatar-uploader-icon add-avatar"></i>
            </el-upload>
            <!--<img class="thumb" :src="bangumi.thumb"/>-->
          </div>
          <div class="bangumi-info-item">
            <p>共{{bangumi.et}}集</p>
            <p>{{bangumi.hzi===1?'有第0集':'无第0集'}}</p>
            <p>提交日期:<br>{{formateDate(bangumi.create_time)}}</p>
            <p>修改日期:<br>{{formateDate(bangumi.modify_time)}}</p>
            <p v-if="bangumi.msg">修改意见:<br>
              <el-tooltip placement="top">
                <div slot="content">{{bangumi.msg}}</div>
                 <span>{{getMsg}}</span>
              </el-tooltip>
            </p>
            <p v-if="bangumi.manager_user">审核:
              <el-popover
                      placement="top-start"
                      trigger="hover">
                <div class="manager-info">
                  <div class="manager-avatar-wrapper">
                    <img class="manager-avatar-img" :src="bangumi.manager_user.face"/>
                  </div>
                  <div class="manager-nick">
                    <span class="manager-nick-link">
                      <a target="_blank" :href="'#/home/userdetail/'+bangumi.manager_user.uid">
                        {{bangumi.manager_user.nick}}
                      </a>
                    </span>
                  </div>
                </div>
                <span class="manager-nick-link" slot="reference">
                  <a target="_blank" :href="'#/home/userdetail/'+bangumi.manager_user.uid">
                    {{bangumi.manager_user.nick}}
                  </a>
                </span>
              </el-popover>
            </p>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="post-user">
          <div class="avatar-wrapper">
            <img class="avatar-img" :src="bangumi.post_user.face"/>
          </div>
          <div class="user-nick">
            <a target="_blank" :href="'#/home/userdetail/'+bangumi.post_user.uid">
              <span style="color: #a5a5a5;">
                {{bangumi.post_user.nick}}
              </span>
            </a>
          </div>
        </div>
        <div class="operation">
          <el-button @click="approveUPB" size="small" type="success" icon="el-icon-check" circle></el-button>
          <el-button @click="declineUPB" size="small" type="danger" icon="el-icon-delete" circle></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api"
  import util from "../../util/util"

  export default {
    // name: "PostBangumiCard",
    props: ['bangumi'],
    data(){
      return {
        validBangumiInfo:{
          bangumiId: "",
          bangumiName: "",
          thumb: "",
          episodeTotal: ""
        },
        amendMsg: ""
      }
    },
    computed:{
      isPending(){
        return this.bangumi.pbs_name === "待处理";
      },
      isSuccess(){
        return this.bangumi.pbs_name === "已采纳";
      },
      isNotPerfect(){
        return this.bangumi.pbs_name === "待完善";
      },
      isFailed(){
        return this.bangumi.pbs_name === "未被采纳";
      },
      getMsg(){
        if(this.bangumi.msg){
          if(this.bangumi.msg.length>10){
            console.log("substring:",this.bangumi.msg.substring(0,10));
            return this.bangumi.msg.substring(0,10)+"...";
          }
        }
        return this.bangumi.msg;
      }
    },
    methods:{
      formateDate(ts) {
        return util.formateDate(ts);
      },
      async approveUPB(){
        console.log("approve adding bangumi");
        this.validBangumiInfo.bangumiName = this.bangumi.bn;
        this.validBangumiInfo.thumb = this.bangumi.thumb;
        this.validBangumiInfo.episodeTotal = this.bangumi.et;
        console.log("validBangumiInfo:",this.validBangumiInfo);
        this.$confirm("确认番剧信息无误？", "提示",{
          confirmButtonText: "OK",
          cancelButtonText: "不行",
          type: "warning",
          callback: async (action) => {
            if (action === "confirm") {
              console.log("postBangumi id:",this.bangumi.id);
              let res = await API.acceptUserPostBangumi(this.bangumi.id);
              let rd = res.data;
              console.log("accept rd:",rd);
              if(rd.code === 0){
                this.bangumi.pbs_name = "已采纳";
                this.$emit("updatePostBangumiCard",rd.data.id);
                this.$message({
                  showClose: true,
                  message: "已添加对应番剧信息",
                  type: "success"
                });
              }
              else {
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
      async declineUPB(){
        console.log("decline adding bangumi");
        this.$prompt("错误信息提示：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            if (action === "confirm") {
              console.log("错误信息提示：" + instance.inputValue);
              let res = await API.declineUserPostBangumi(this.bangumi.id,2,instance.inputValue);
              let rd = res.data;
              console.log("decline rd:",rd);
              if(rd.code === 0){
                this.bangumi.pbs_name = "待完善";
                this.$emit("updatePostBangumiCard",rd.data.id);
                this.$message({
                  showClose: true,
                  message: "已反馈错误信息",
                  type: "success"
                });
              }
              else {
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
      handleAvatarSuccess(res, file) {
        console.log("handleAvatarSucc invoked!");
        console.log(res);
        console.log(file);
        let link = res.data.link;
        link = link.substring(link.lastIndexOf('/'));
        console.log("link:",link);
        this.bangumi.thumb = this.GLOBAL.imgURL+link;
        console.log(this.bangumi.thumb);
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
      }
    }
  }
</script>

<style scoped>
  .box-card {
    border-radius: 4px;
    background-color: rgba(0,0,0,.1);
    width: 400px;
    height: 345px;
    box-shadow: 1px 2px 12px 0 rgba(0,0,0,.5);
  }
  .card-header {
    height: 35px;
    border-bottom: 1px solid #1b1717;
  }
  .card-header .pb-status {
    display: inline-block;
    /*border: 1px solid;*/
    color: #e2d5c4;
    border-radius: 3%;
    float: right;
    padding: 3px 5px;
  }
  .pending {
    background-color: #a77427;
  }
  .success {
    background-color: #367b13;
  }
  .nperfect {
    background-color: #3580ce;
  }
  .failed {
    background-color: #9e0c0c;
  }
  .card-body {
    margin: 10px;
  }
  .card-footer {
    padding-top: 10px;
    border-top: 1px solid #101010;
  }
  .bangumi-info {
    display: inline-flex;
    height: 230px;
  }
  .thumb-wrapper {
    width: 160px;
    height: 260px;
    float: left;
  }
  .thumb {
    width: 160px;
    height: 230px;
  }
  .add-avatar {
    width: 160px;
    height: 230px;
    line-height: 230px;
    border: 1px solid #d9d9d9;
  }
  .add-avatar:hover {
    border-color: #409EFF;
  }
  .bangumi-info-item {
    display: inline-block;
    margin-left: 5px;
    color: #c0c4cc;
  }
  .bangumi-info-item p {
    margin: 5px;
  }
  .post-user {
    display: inline-flex;;
  }
  .avatar-wrapper {
    width: 35px;
    height: 35px;
    display: inline-block;
    margin-left: 10px;
  }
  .avatar-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .user-nick {
    margin-top: 10px;
    margin-left: 3px;
    display: inline-block;
  }
  .user-nick a {
    text-decoration: none;
  }
  .user-nick a:hover {
    color: #20968b;
  }
  .operation {
    display: inline-block;
    float: right;
    margin-right: 10px;
  }
  .manager-info {
    display: inline-flex;
  }
  .manager-nick-link a {
    color: #20968b;;
  }
  .manager-info .manager-avatar-wrapper {
    width: 58px;
    height: 58px;
  }
  .manager-avatar-img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: inline-block;
  }
  .manager-nick {
    display: inline-block;
  }

</style>
