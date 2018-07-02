<template>
    <div id="home">
        <el-container style="z-index:1000;position: fixed;height: 60px;background-color: transparent;width: 100%;right: 0;top:0;">
      <el-header style="background-color:rgba(20,20,34,0.9);text-align: right; font-size: 12px">
      <el-dropdown>
        <div class="avatar-wrapper">
            <img class="avatar" :src="userInfo.face?userInfo.face:'/static/rm.jpg'">
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{userInfo.nick}}</el-dropdown-item>
          <div @click="logout"><el-dropdown-item>登出</el-dropdown-item></div>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    </el-container>

    <el-container style="margin-top:60px;">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246);margin-right: 20px;">
    <el-menu 
    background-color="#262633"
    text-color="#f9efc1"
    active-text-color="#d8c13a"
    :default-openeds="['1', '3']"
    :default-active="activeIndex">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>导航一</template>
        <el-menu-item-group>
          <template slot="title">HOME</template>
          <router-link to="/home/index"><el-menu-item index="1-1">index</el-menu-item></router-link>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项4-1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>导航二</template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="2-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项4-1</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </el-aside>
  
  <el-container>   
    <el-main style="background-color:#262633">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
    </div>
</template>

<script>
import HelloWorld from "./HelloWorld.vue";
import API from "../api/api";
export default {
    data(){
        return {
            activeIndex: "1-1",
            userInfo:{
              uid:"",
              nick:"",
              face:"",
              role:""
            }
        }
    },
    components:{
        "hello-world": HelloWorld
    },
    methods:{
        async logout(){
        console.log("logout~!");
        let sendLogout = false;
        if(localStorage.getItem("token")){
          sendLogout = true;
        }
        
        if(sendLogout){
             await API.logout();
        }
        localStorage.clear();
        window.location.href = "#/login";
      }
    },
    created() {
      this.userInfo.uid = localStorage.getItem("uid");
      this.userInfo.nick = localStorage.getItem("nick");
      this.userInfo.face = localStorage.getItem("face");
      this.userInfo.role = localStorage.getItem("role");
    }
}
</script>

<style scoped>
.avatar-wrapper {
  padding-top: 13px;
  cursor: pointer;
  position: relative;
  height: 40px;
  line-height: 40px;
}
.avatar-wrapper .avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
</style>
