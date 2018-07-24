<template>
  <div class="online-user">
    <div v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-distance="30"
         class="online-user-container">
      <div class="ol-user-item" v-for="u in users" :key="u.userId">
        <div class="user-face-wrap">
          <img :src="u.face?u.face:'/static/akari.jpg'" class="ol-user-face">
        </div>
        <div class="ol-user-info">
          <div class="u-nick">
            <el-tooltip class="item" effect="dark" :content="u.nick" placement="top-start">
              <a target="_blank" :href="'#/home/userdetail/'+u.userId">
                {{u.nick.substring(0,6)}}
              </a>
            </el-tooltip>
          </div>
          <div class="u-age">{{u.age}}</div>
          <div class="u-sex">{{u.sex}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import infiniteScroll from "vue-infinite-scroll";
  import API from "../../api/api"
  export default {
    name: "OnlineUserList",
    data(){
      return {
        users: [],
        page: {pageNumber: 0},
        busy: true,
        today: false
      }
    },
    directives: {
      infiniteScroll
    },
    methods:{
      async initOnlineUsers(){
        let res;
        if(this.today){
          res = await API.getOnlineUsers(1, 30, 1);
        }
        else {
          res = await API.getOnlineUsers(1, 30);
        }
        let rd = res.data;
        if(rd.code === 0){
          this.users = rd.data.users;
          this.page = rd.data.page;
        }
      },
      async getOnlineUsers(pn,ps){
        let res = await API.getOnlineUsers(pn,ps);
        let rd = res.data;
        if(rd.code === 0){
          this.users = rd.data.users;
          this.page = rd.data.page;
        }
      },
      async loadMore() {
        this.busy = true;
        setTimeout(async () => {
          let res;
          if(this.today){
            res = await API.getOnlineUsers(this.page.pageNumber + 1,30,1);
          }
          else {
            res = res = await API.getOnlineUsers(this.page.pageNumber + 1,30);
          }
          let rd = res.data;
          if (rd.code === 0) {
            if (rd.data.users.length > 0) {
              this.users = this.users.concat(rd.data.users);
              this.page = rd.data.page;
              console.log("onlineusers:", this.users);
              console.log("page:", this.page);
            }
            console.log("loadMore get Data success");
          } else {
            console.log("loadMore失败");
          }
        }, 100);
        this.busy = false;
      },
    },
    created(){
      console.log("onlineUser.vue created");
      let td = this.$route.params.today;
      console.log("today:",td);
      if(td){
        this.today = true;
      }
      this.initOnlineUsers();
    }
  }
</script>

<style scoped>
  .online-user {
    width: 100%;
    height: 100%;
  }
  .online-user-container {
    max-height: 1000px;
  }
  .ol-user-item {
    width: 200px;
    height: 100px;
    margin: 5px;
    display: inline-flex;
    border-radius: 4px;
    background: rosybrown;
    padding: 3px;
  }
  .user-face-wrap {
    width: 100px;
    height: 100px;
    display: inline-block;
  }
  .user-face-wrap .ol-user-face {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .ol-user-info {
    display: inline-block;
    height: 100px;
    margin-top: 8px;
    margin-left: 8px;
    color: white;
  }
  .ol-user-info div {
    line-height: 30px;
    height: 30px;
  }
  .u-nick {
    height: 40px;
  }
  .u-nick a {
    text-decoration: none;
    font-size: 14px;
  }
  .u-nick a:hover{
    cursor: pointer;
    color: blue;
  }
</style>