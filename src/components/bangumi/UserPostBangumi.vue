<template>
  <div class="user-post-bangumi">

    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="用户名">
      </el-input>
      <el-button class="filter-item" style="margin-left:10px" circle type="primary" icon="el-icon-search"></el-button>

      <el-button @click="showAll" class="filter-item" type="primary">显示全部</el-button>
      <div style="display: inline-block; float: right">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">标签
            <i class="el-icon-arrow-down el-icon--right">
            </i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="o.value" :key="o.label" v-for="o in pbOptions">
              {{o.label}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
    data() {
      return {
        bangumis: [],
        page: "",
        loading: true,
        pbOptions: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '待处理'
        }, {
          value: '2',
          label: '已采纳'
        }, {
          value: '3',
          label: '待完善'
        }, {
          value: '4',
          label: '未被采纳'
        }, {
          value: '5',
          label: '待审核'
        }],
        pbParams: {
          pn: 1,
          ps: 10,
          sc: '',
          pbsc: '',
          pc: '',
          dc: '',
          bn: ''
        }
      }
    },
    components: {
      "my-card": MyCard
    },
    methods: {
      async initUserPostBangumis() {
        let res = await API.getUserPostBangumis(1, 10);
        let rd = res.data;
        if (rd.code === 0) {
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
        this.pbParams.pn = 1;
        this.pbParams.ps = val;
        let res = await API.getUserPostBangumisByParams(this.pbParams);
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
        this.pbParams.pn = val;
        this.pbParams.ps = this.page.pageSize;
        let res = await API.getUserPostBangumisByParams(this.pbParams);
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
      formateDate(ts) {
        return util.formateDate(ts);
      },
      updatePostBangumiCard(id) {
        console.log("updateUserPostBCard,id:", id);
        setTimeout(() => {
          console.log("delay 3s")
          this.bangumis = this.bangumis.filter(t => t.id != id);
        }, 3000)
      },
      async showAll() {
        let res = await API.getUserPostBangumis(1, 10);
        let rd = res.data;
        if (rd.code === 0) {
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
      },
      async handleCommand(command) {
        console.log("command:",command);
        if (command === '0') {
          this.pbParams.pbsc = '';
        } else {
          this.pbParams.pbsc = command;
        }
        this.pbParams.pn = 1;
        let res = await API.getUserPostBangumisByParams(this.pbParams);
        let rd = res.data;
        if(rd.code === 0){
          this.bangumis = rd.data.postBangumi;
          this.page = rd.data.page;
          this.loading = false;
        }
        else {
          console.log("get userPostBangumi err");
        }
      }
    },
    created() {
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