<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Home from "./components/Home.vue";

export default {
  name: "app",
  components: {
    HelloWorld,
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
</style>

