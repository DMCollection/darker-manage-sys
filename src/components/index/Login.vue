<template>
    <div ref="loginctx" class="login-container">
        <div class="login-box">
        <h1>LOGIN</h1>
        <div class="login-form">
           <el-form style="margin-left:0;margin-right:0;" ref="Login" size="small" label-position="left" label-width="40px" :model="loginInfo">
            <el-form-item label="账户">
            <el-input v-model="loginInfo.principal"></el-input>
           </el-form-item>
           <el-form-item label="密钥">
           <el-input type="password" v-model="loginInfo.password"></el-input>
           </el-form-item>
           <el-form-item style="text-align:left">
              <el-button @click="login" type="primary">登入</el-button>
           </el-form-item>
        </el-form>
        </div>
        </div>
    </div>
</template>

<script>
import API from "../../api/api";
export default {
    data(){
        return {
            loginInfo:{
                principal: "",
                password: "",
                remember_me: 0
            }
        }
    },
    methods:{
        async login() {
      if (this.loginInfo.principal === "" || this.loginInfo.password === "") {
        this.$message({
          message: "账号或密码为空",
          type: "info"
        });
        return false;
      }
      let res = await API.login(this.loginInfo);
      let rd = res.data;
      let uid = "";
      let token = "";
      let face = "";
      let role = "";
      let loginUserName = "";
      console.log("login return data:",rd.data);
      if (rd.code === 2002 || rd.data == null) {
        this.$message({
          message: "账号不存在或密码错误",
          type: "error"
        });
        return false;
      }
      if (rd.code === 0 || rd.msg === "OK") {
        token = rd.data.token;
        loginUserName = rd.data.user.nick;
        uid = rd.data.user.uid;
        face = rd.data.user.face;
        role = rd.data.user.role;
        if(role === "ROLE_USER"){
          this.$message({
            message: "该用户没有权限",
            type: "error"
          });
          window.location.href = "#/login";
          return ;
        }
        if (!token) {
          this.$message({
            message: "无法获取到Token",
            type: "error"
          });
        }
      }
      //检测localStorage , 若不存在则发出提示
      if (this.checkLocalStorage()) {
        //保存到localStorage
        localStorage.setItem("uid", uid);
        localStorage.setItem("token", token);
        localStorage.setItem("nick", loginUserName);
        localStorage.setItem("face",face);
        localStorage.setItem("role",role);
        window.location.href = "#/home/index";
      }
    },
    checkLocalStorage() {
      if (typeof window.localStorage === "undefined") {
        this.$message({
          message: "请关闭隐私模式,或者浏览器太老旧了,否则无法保存登录状态",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    }
    }
}
</script>

<style scoped>
.login-box {
  /* width: 700px; */
  margin: 0 auto;
  text-align: center;
}
.login-form {
  width: 300px;
  margin: 0 auto;
}
</style>
