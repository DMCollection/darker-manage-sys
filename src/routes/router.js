import Vue from "vue";
import VueRouter from 'vue-router'

import Home from "../components/Home.vue";
import Login from "../components/index/Login.vue";
import ApiTest from "../components/jsonresp/ApiTest.vue";
import Index from "../components/index/Index.vue";

import UserList from "../components/user/UserList.vue";
import UserDetail from "../components/user/UserDetail.vue";
import OnlineUsersList from "../components/user/OnlineUserList.vue";

import BangumiList from "../components/bangumi/BangumiList.vue";
import BangumiDetail from "../components/bangumi/BangumiDetail.vue";
import BangumiEdit from "../components/bangumi/BangumiEdit.vue";
import UserPostBangumi from "../components/bangumi/UserPostBangumi.vue";

import EpisodeList from "../components/episode/EpisodeList.vue";
import EpisodeDetail from "../components/episode/EpisodeDetail.vue";

import VideoList from "../components/video/VideoList.vue";
import VideoDetail from "../components/video/VideoDetail.vue";
import UserPostVideo from "../components/video/UserPostVideo.vue";

import DanmakuList from "../components/danmaku/DanmakuList.vue";
import ReportList from "../components/danmaku/ReportList.vue";

import AnnounceList from "../components/announce/AnnounceList.vue";
import AnnouncePost from "../components/announce/AnnouncePost.vue";
import AnnouncePreview from "../components/announce/AnnouncePreview.vue";
import SystemNotice from "../components/announce/SysNotice.vue";
import SystemLog from "../components/log/SystemLog.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/announce/preview", name: "annpreview", component: AnnouncePreview},
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
      { path: "index", component: Index, name: "index" },
      { path: "apitest", component: ApiTest, name: "apitest"},
      { path: "user", component: UserList, name: "userlist"},
      { path: "userdetail/:uid", component: UserDetail, name: "userdetail"},
      { path: "bangumi", component: BangumiList, name: "bangumilist"},
      { path: "bangumidetail/:bid", component: BangumiDetail, name: "bangumidetail"},
      { path: "bangumiedit", component: BangumiEdit, name: "bangumiedit"},
      { path: "bangumi/userpost", component: UserPostBangumi, name: "userpostbangumi"},
      { path: "episode", component: EpisodeList, name: "episodelist"},
      { path: "episodedetail/:eid", component: EpisodeDetail, name: "episodedetail"},
      { path: "video", component: VideoList, name: "videolist"},
      { path: "videodetail/:vid", component: VideoDetail, name: "videodetail"},
      { path: "video/userpost", component: UserPostVideo, name: "userpostvideo"},
      { path: "danmaku", component: DanmakuList, name: "danmakulist"},
      { path: "reportlist", component: ReportList, name: "reportlist"},
      { path: "announce", component: AnnounceList, name: "announcelist"},
      { path: "announce/new", component: AnnouncePost, name: "announcepost"},
      { path: "snotice", component: SystemNotice, name: "systemnotice"},
      { path: "online/users/:today", component: OnlineUsersList, name: "onlineuser"},
      { path: "log", component: SystemLog, name: "log"}
    ]
  },
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  // mode: 'history',
  routes // （缩写）相当于 routes: routes
});
export default router;
