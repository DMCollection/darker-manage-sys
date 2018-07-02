import Vue from "vue";

import VueRouter from 'vue-router'
import HelloWorld from "../components/HelloWorld.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "HelloWorld", component: HelloWorld },
  {
    path: "/space",
    component: HelloWorld,
    name: "space",
    children: [
      { path: "avatar", component: HelloWorld, name: "avatar" },
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
