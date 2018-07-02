<template>
  <div id="app">
    <el-container style="z-index:1000;position: fixed;height: 60px;background-color: transparent;width: 100%;right: 0;top:0;">
      <el-header style="background-color:rgba(20,20,34,0.9);text-align: right; font-size: 12px">
      <el-dropdown>
        <div class="avatar-wrapper">
            <img class="avatar" src="/static/rm.jpg">
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item>新增</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
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
    :default-openeds="['1', '3']">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>导航一</template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
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
      <h1>MY VIEW</h1>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  data() {
    return {
      isLogin: false
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}
body {
  padding: 0;
  margin: 0;
  background-image: url(/static/star-background.jpg);
  background-position-x: center;
  background-position-y: top;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  /* background-color: #141422; */
  color: #20968b;
}
.text-color-green {
  color: #20968b;
}
.text-color-white {
  color: #d0d0d2;
}
</style>

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

