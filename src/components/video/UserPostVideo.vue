<template>
  <div class="user-post-video">
    <h1>用户提交的视频信息列表</h1>
    <div class="videos">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item">
        </el-input>
        <el-button class="filter-item" style="margin-left:10px" circle type="primary" icon="el-icon-search"></el-button>
        <!--<el-button class="filter-item" type="primary" icon="el-icon-edit">添加-->
        <!--</el-button>-->
        <el-button class="filter-item" type="primary" icon="el-icon-delete">批量删除</el-button>
        <!--<el-button class="filter-item" type="primary">导出</el-button>-->
        <el-button class="filter-item" type="primary">显示全部</el-button>
      </div>

      <el-table height='600' ref="video-tb" :data="videos" border highlight-current-row>
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column label='id' width="120">
          <template slot-scope="scope">
            {{scope.row.videoId}}
          </template>
        </el-table-column>

        <el-table-column label="md5" align="center" width="150">
          <template slot-scope="scope">
            {{scope.row.vMd5}}
          </template>
        </el-table-column>

        <el-table-column label="文件大小（MB）" align="center" width="150">
          <template slot-scope="scope">
            <p>{{(scope.row.fileSize/1024/1024).toFixed(2)}}</p>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" width="200">
          <template slot-scope="scope">
            <span>{{formateDate(scope.row.createTime)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="修改时间" width="200">
          <template slot-scope="scope">
            <span>{{formateDate(scope.row.modifyTime)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="score" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.score}}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" min-width="120" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="acceptVideo(scope.row)" icon="el-icon-check" circle></el-button>
            <el-button type="danger" @click="deleteVideo(scope.row.videoId)" icon="el-icon-delete" circle></el-button>
            <!--<el-button type="warning" icon="el-icon-edit" circle @click="toEpisode(scope.row.bangumiId)"></el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div v-if="!loading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="page.pageNumber"
                       :page-sizes="[10,20,30, 50]" :page-size="page.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="page.totalSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api"

  export default {
    name: "UserPostVideo",
    data() {
      return {
        videos: [],
        page: "",
        loading: true
      }
    },
    methods: {
      async initVideos() {
        let res = await API.getVideos(0, 1, 20);
        let rd = res.data;
        if (rd.code === 0) {
          this.videos = rd.data.videos;
          this.page = rd.data.pageInfo;
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
        let res = await API.getVideos(0, 1, val);
        let rd = res.data;
        if (rd.code === 0) {
          this.videos = rd.data.videos;
          this.page = rd.data.pageInfo;
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
        let res = await API.getVideos(0, val, this.page.pageSize);
        const rd = res.data;
        console.log(rd);
        if (rd.code === 0) {
          this.videos = rd.data.videos;
          this.page = rd.data.pageInfo;
        } else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      },
      async acceptVideo(video) {
        video.isMatch = 1;
        this.$confirm("添加该视频匹配信息？", "提示", {
          confirmButtonText: "OK",
          cancelButtonText: "不行",
          type: "warning",
          callback: async (action) => {
            if (action === "confirm") {
              let res = await API.editVideo(video.videoId, video);
              let rd = res.data;
              if (rd.code === 0) {
                this.$message({
                  showClose: true,
                  message: "已添加对应视频匹配信息",
                  type: "success"
                });
                this.intervalId = setTimeout(() => {
                  this.videos = this.videos.filter(t => t.videoId != video.videoId);
                }, 2000);
              }
              else {
                this.$message({
                  showClose: true,
                  message: rd.msg,
                  type: "error"
                });
              }
            }
          }
        });
      },
      async deleteVideo(vid) {
        this.$confirm("删除该视频匹配信息？", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action) => {
            if (action === "confirm") {
              console.log("vid:",vid);
              let res = await API.deleteVideo(vid);
              let rd = res.data;
              if (rd.code === 0) {
                this.$message({
                  showClose: true,
                  message: "已删除对应视频匹配信息",
                  type: "success"
                });
                this.videos = this.videos.filter(t => t.videoId != vid);
              }
              else {
                this.$message({
                  showClose: true,
                  message: rd.msg,
                  type: "error"
                });
              }
            }
          }
        });
      },
      formateDate(ts) {
        let d = new Date(ts);
        return d.getFullYear() + "/" + this.fillZero(d.getMonth() + 1) + "/" +
            this.fillZero(d.getDate()) + " " + this.fillZero(d.getHours()) + ':' +
            this.fillZero(d.getMinutes()) + ":" + this.fillZero(d.getSeconds());
      },
      fillZero(num) {
        return num < 10 ? '0' + num : num;
      }
    },
    created() {
      console.log("UserPostVIdeo.vue created!!!");
      this.initVideos();
    }
  }
</script>

<style scoped>

</style>