<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Home from "./components/Home.vue";

export default {
  name: "app",
  components: {
    Home
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
  width: 100%;
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
  background-color: #141422;
  color: #20968b;
}
.text-color-green {
  color: #20968b;
}
.text-color-white {
  color: #d0d0d2;
}
  .el-message-box {
    background-color: #0c0505;
    border: 1px solid #000000;
  }
.el-message-box__title {
  color: #a9a9a9;
}
.el-message-box__content {
  color: #a4a6ab;
}

  .el-message-box__input .el-input .el-input__inner {
    background-color: #0f0f19;
    border: 1px solid #393945;
  }

</style>

