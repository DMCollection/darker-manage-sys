<template>
  <div class="user-detail">
    <div class="user-avatar-container">
      <div class="user-avatar-wrapper">
        <el-upload
                class="avatar-uploader"
                :action="GLOBAL.uploadURL"
                name="image"
                :headers="GLOBAL.uploadHEADERS"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
          <img class="user-avatar-img" :src="userInfo.face?userInfo.face:''"/>
        </el-upload>
      </div>
    </div>

    <div class="user-other-info">
      <div v-if="!edit" @click="handleEdit" class="edit-user">
        <i class="el-icon-edit edit-icon"></i>
      </div>
      <div v-else class="edit-user">
        <i style="margin-right: 5px" @click="handleSaveUserInfo" class="el-icon-success save-icon"></i>
        <i @click="handleDiscardUserInfo" class="el-icon-error discard-icon"></i>
      </div>
      <div class="user-info-item">
        <div class="user-id">
          <p>用户id：{{userInfo.userId}}</p>
        </div>
      </div>

      <div class="user-info-item">
        <div class="user-nick">
          <p v-if="!edit">昵称：{{userInfo.nick}}</p>
          <p v-else>
            昵称：<el-input style="width: 200px" size="mini" v-model="tmpUserInfo.nick"></el-input>
          </p>
        </div>
      </div>

      <div class="user-info-item">
        <div class="user-sex">
          <p v-if="!edit">性别：{{userInfo.sex}}</p>
          <p v-else>
            性别：
            <el-select size="mini" style="width: 100px" v-model="tmpUserInfo.sex">
              <el-option
                      v-for="item in sexOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </p>
        </div>
      </div>

      <div class="user-info-item">
        <div class="user-age">
          <p v-if="!edit">年龄：{{userInfo.age}}</p>
          <p v-else>
            年龄：<el-input style="width: 100px" size="mini" v-model="tmpUserInfo.age"></el-input>
          </p>
        </div>
      </div>

      <div class="user-info-item">
        <div class="user-role">
          <p>角色：{{userInfo.role}}</p>

        </div>
      </div>

      <div class="user-info-item">
        <div class="user-email">
          <p>邮箱：{{userInfo.email}}</p>
        </div>
      </div>
      <div class="user-info-item">
        <div class="user-email-v">
          <p>邮箱已验证：{{userInfo.emailVerified}}</p>

        </div>
      </div>
      <div class="user-info-item">
        <div class="user-phone">
          <p>手机号：{{userInfo.phone}}</p>

        </div>
      </div>
      <div class="user-info-item">
        <div class="user-phone-v">
          <p>手机号已验证：{{userInfo.phoneVerified}}</p>

        </div>
      </div>
      <div class="user-info-item">
        <div class="user-reg-time">
          <p>注册时间：{{formateDate(userInfo.createTime)}}</p>

        </div>
      </div>
      <div class="user-info-item">
        <div class="user-modify-time">
          <p>修改时间：{{formateDate(userInfo.modifyTime)}}</p>

        </div>
      </div>
      <div class="user-info-item">
        <div class="user-lock">
          <p>是否被锁定：{{userInfo.isLock}}</p>

        </div>
      </div>
      <div class="user-info-item">
        <div class="user-lock-time">
          <p>锁定时长：{{userInfo.lockTime}}</p>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import API from "../../api/api"
  import util from "../../util/util"

  export default {
    name: "UserDetail",
    data() {
      return {
        userInfo: {},
        tmpUserInfo: {},
        edit: false,
        sexOptions:[
          {
            value: '男',
            label: '男'
          }, {
            value: '女',
            label: '女'
          }, {
            value: '不明',
            label: '不明'
          }
        ]
      }
    },
    methods: {
      async getUserDetail(uid) {
        let res = await API.getUserByUid(uid);
        let rd = res.data;
        console.log("userDetail:", rd);
        if (rd.code === 0) {
          this.userInfo = rd.data;
        }
        else {
          this.$message({
            message: rd.msg,
            type: "error"
          });
        }
      },
      formateDate(ts) {
        return util.formateDate(ts);
      },
      handleAvatarSuccess(res, file) {
        console.log("handleAvatarSucc invoked!");
        console.log(res);
        console.log(file);
        let link = res.data.link;
        link = link.substring(link.lastIndexOf('/'));
        console.log("link:",link);
        this.userInfo.face = this.GLOBAL.imgURL+link;
        console.log(this.userInfo.face);
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
      handleEdit(){
        this.edit = true;
        this.tmpUserInfo = JSON.parse(JSON.stringify(this.userInfo));
        console.log("tmpUserInfo:",this.tmpUserInfo);
        console.log("edit user!");
      },
      handleSaveUserInfo(){
        this.userInfo = JSON.parse(JSON.stringify(this.tmpUserInfo));
        console.log("userInfo:",this.userInfo);
        console.log("HandleSaveUserInfo...");
        this.edit = false;
      },
      handleDiscardUserInfo(){
        this.edit = false;
        console.log("handleDiscardUserInf...");
      }
    },
    created() {
      console.log("UserDetail.vue created!");
      let uid = this.$route.params.uid;
      console.log("get uid from params:", uid);
      if (uid) {
        this.getUserDetail(uid);
      }
    }
  }
</script>

<style scoped>
  .user-avatar-container {
    margin-bottom: 10px;
  }
  .user-avatar-wrapper {
    width: 100px;
    height: 100px;
  }
  .user-avatar-wrapper .user-avatar-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .user-other-info {
    width: 400px;
    border: 1px solid #868080;
    padding: 10px;
  }
  .edit-user {
    float: right;
    color: #c0c4cc;
  }
</style>