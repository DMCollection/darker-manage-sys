import Vue from "vue";

import VueRouter from 'vue-router'
import Home from "../components/Home.vue";
import HelloWorld from "../components/HelloWorld.vue";
import Login from "../components/index/Login.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/login", name: "login", component: Login },
  {
    path: '/',
    redirect: '/home/index',  //重定向到默认首页
    hidden: true,  
  },
  {
    path: "/home",
    component: Home,
    name: "home",
    children: [
      { path: "index", component: HelloWorld, name: "index" },
    ]
  }
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  // mode: 'history',
  routes // （缩写）相当于 routes: routes
});
export default router;
