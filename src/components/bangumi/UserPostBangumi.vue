<template>
  <div class="user-post-bangumi">

    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item"  placeholder="用户名"
                >
      </el-input>
      <el-button class="filter-item" style="margin-left:10px" circle type="primary" icon="el-icon-search"
                 ></el-button>

      <el-button @click="showAll" class="filter-item" type="primary">显示全部</el-button>
    </div>

    <div class="cards">
      <div class="card-wrapper" v-for="bangumi in bangumis" :key="bangumi.id">
        <my-card v-on:updatePostBangumiCard="updatePostBangumiCard" :bangumi="bangumi"></my-card>
      </div>
    </div>

    <div v-if="!loading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="page.pageNumber"
                     :page-sizes="[10,20,30, 50]" :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.totalSize">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import API from "../../api/api"
  import util from "../../util/util"
  import MyCard from "./PostBangumiCard.vue";
  export default {
    name: "UserPostBangumi",
    data(){
      return {
        bangumis: [],
        page: "",
        loading: true
      }
    },
    components: {
      "my-card": MyCard
    },
    methods: {
      async initUserPostBangumis(){
        let res = await API.getUserPostBangumis(1,10);
        let rd = res.data;
        if(rd.code === 0){
          this.bangumis = rd.data.postBangumi;
          this.page = rd.data.page;
          this.loading = false;
        }
        else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      },
      async handleSizeChange(val) {
        console.log("每页" + val + "条");
        let res = await API.getUserPostBangumis(1,val);
        let rd = res.data;
        if (rd.code === 0) {
          this.bangumis = rd.data.postBangumi;
          this.page = rd.data.page;
        } else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      },
      async handleCurrentChange(val) {
        console.log("curpage:" + val);
        let res = await API.getUserPostBangumis(val,this.page.pageSize);
        let rd = res.data;
        console.log(rd);
        if (rd.code === 0) {
          this.bangumis = rd.data.postBangumi;
          this.page = rd.data.page;
        } else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      },
      formateDate(ts){
        return util.formateDate(ts);
      },
      updatePostBangumiCard(id){
        console.log("updateUserPostBCard,id:",id);
        setTimeout(()=>{
          console.log("delay 3s")
          this.bangumis = this.bangumis.filter(t=>t.id!=id);
        },3000)
      },
      async showAll(){
        let res = await API.getUserPostBangumis(1,10);
        let rd = res.data;
        if(rd.code === 0){
          this.bangumis = rd.data.postBangumi;
          this.page = rd.data.page;
        }
        else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      }
    },
    created(){
      console.log("UserPostBangumi.vue created!!!");
      this.initUserPostBangumis();
    }
  }
</script>

<style scoped>
  .filter-container {
    margin: 10px;
  }
.card-wrapper {
  display: inline-block;
  margin: 20px;
}
</style>