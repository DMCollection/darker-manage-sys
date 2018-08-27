<template>
  <div id="home">
    <el-container
            style="z-index:1000;position: fixed;height: 60px;background-color: transparent;width: 100%;right: 0;top:0;">
      <el-header style="background-color:rgba(20,20,34,0.9);text-align: right; font-size: 12px">
        <el-dropdown>
          <div class="avatar-wrapper">
            <img class="avatar" :src="userInfo.face?userInfo.face:'/static/akari.jpg'">
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{userInfo.nick}}</el-dropdown-item>
            <div @click="logout">
              <el-dropdown-item>登出</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>

    <el-container style="margin-top:60px;">
      <el-aside width="200px" style="margin-right: 20px;">
        <el-menu
                background-color="#262633"
                text-color="#f9efc1"
                :router="true"
                active-text-color="#d8c13a"
                :default-active="activeIndex">
          <el-menu-item :route="{path: '/home/index'}" index="0">
            DARKER后台首页
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>番剧管理</template>
            <el-menu-item :route="{path: '/home/bangumi'}" index="1-1">番剧列表</el-menu-item>
            <el-menu-item :route="{path: '/home/bangumiedit'}" index="#">新增番剧</el-menu-item>
            <el-menu-item :route="{path: '/home/bangumi/userpost'}" index="1-3">提交列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-message"></i>剧集管理</template>
            <el-menu-item :route="{path: '/home/episode'}" index="2-1">剧集列表</el-menu-item>
            <el-menu-item index="#">新增剧集</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-message"></i>视频管理</template>
            <el-menu-item :route="{path: '/home/video'}" index="3-1">视频列表</el-menu-item>
            <el-menu-item :route="{path: '/home/video/userpost'}" index="3-2">提交列表</el-menu-item>
            <el-menu-item index="#">新增视频</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-message"></i>弹幕管理</template>
            <el-menu-item :route="{path: '/home/danmaku'}" index="4-1">弹幕列表</el-menu-item>
            <el-menu-item index="#">被举报弹幕</el-menu-item>
            <el-menu-item index="#">弹幕过滤规则</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-message"></i>用户管理</template>
            <el-menu-item :route="{path: '/home/user'}" index="5-1">用户列表</el-menu-item>
            <el-menu-item index="#">锁定用户</el-menu-item>
          </el-submenu>

          <el-submenu index="6">
            <template slot="title"><i class="el-icon-message"></i>公告管理</template>
            <el-menu-item :route="{path: '/home/announce'}" index="6-1">公告列表</el-menu-item>
            <el-menu-item :route="{path: '/home/announce/new'}" index="6-2">新增公告</el-menu-item>
            <el-menu-item :route="{path: '/home/snotice'}" index="6-3">系统消息</el-menu-item>
          </el-submenu>

          <el-menu-item :route="{path: '/home/apitest'}" index="7">
            API JSON数据展示
          </el-menu-item>
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
  import API from "../api/api";
  import ApiTest from "../components/jsonresp/ApiTest.vue";
  import UserList from "../components/user/UserList.vue";

  export default {
    data() {
      return {
        activeIndex: "0",
        userInfo: {
          uid: "",
          nick: "",
          face: "",
          role: ""
        }
      }
    },
    components: {
      ApiTest,
      UserList
    },
    methods: {
      logout() {
        console.log("logout~!");
        let sendLogout = false;
        if (localStorage.getItem("token")) {
          sendLogout = true;
        }

        if (sendLogout) {
          API.logout();
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
