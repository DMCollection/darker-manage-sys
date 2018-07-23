<template>
  <div class="announce-list">
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20"
         class="announce-container">
      <div :class="{hlmp:a.isShowIndex}" class="announce-item" v-for="a in announces" :key="a.id">
        <div class="page-container">
          <div class="title-container">
            <h1>{{a.title}}</h1>
            <div>
              <span><i class="el-icon-date" title="发布时间"
                       style="padding-right: 5px"></i>{{a.createTime | formatDate}}</span>
              <span style="margin-left: 15px"><i class="el-icon-view" title="阅读量" style="padding-right: 5px"></i>{{a.viewCount}}</span>
            </div>
          </div>
          <div class="ann-oper">
            <el-button @click="handleEdit(a)">修改</el-button>
            <el-button type="danger" @click="handleDelete(a.id)">删除</el-button>
          </div>
        </div>
      </div>
      <div v-show="announces.length===0">
        <h1>暂无公告</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatDate} from "../../global/time";
  import infiniteScroll from "vue-infinite-scroll";
  import API from "../../api/api"

  export default {
    name: "AnnounceList",
    data() {
      return {
        announces: "",
        busy: true,
        page: {pageNumber: 0},
      }
    },
    directives: {
      infiniteScroll
    },
    filters:{
      formatDate(time){
        let date = new Date(time);
        return formatDate(date,"yyyy-MM-dd hh:mm")
      }
    },
    methods: {
      async initAnnounce() {
        let res = await API.getNotices();
        let rd = res.data;
        if (rd.code === 0) {
          this.announces = rd.data.notices;
          this.page = rd.data.page;
        }
        else {
          console.log("initAnnounces err!");
        }
      },
      async loadMore() {
        this.busy = true;
        setTimeout(async () => {
          let res = await API.getNotices(this.page.pageNumber + 1);
          let rd = res.data;
          if (rd.code === 0) {
            if (rd.data.notices.length > 0) {
              this.announces = this.announces.concat(rd.data.notices);
              this.page = rd.data.page;
              console.log("announces:", this.announces);
              console.log("page:", this.page);
            }
            console.log("loadMore get Data success");
          } else {
            console.log("loadMore失败");
          }
        }, 100);
        this.busy = false;
      },
      async handleEdit(announce){
        console.log("edit announce!");
        this.$router.push({
          name: "announcepost",
          params: {
            announce: announce,
          }
        });
      },
      async handleDelete(id){
        this.$confirm("删除该公告", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            console.log(instance);
            if (action === "confirm") {
              let res = await API.deleteNotice(id);
              if (res.data.code === 0) {
                console.log("删除成功，id:" + id);
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
                this.announces = this.announces.filter(t=>t.id!=id);
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              }
            }
          }
        });
      }
    },
    created() {
      this.initAnnounce();
    }
  }
</script>

<style scoped>
  .announce-item {
    height: 100px;
    width: 90%;
    min-width: 400px;
    border: 1px solid white;
    padding: 20px;
    margin: 10px;
  }
  .announce-container {
    width: 100%;
    height: 100%;
  }
  .title-container {
    display: inline-block;
  }
  .ann-oper {
    display: inline-block;
    float: right;
  }
  .hlmp {
    background-color: #ff0;
  }
</style>