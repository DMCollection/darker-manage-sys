<template>
  <div class="bangumi-detail">
    <h1>番剧详情</h1>
    <div class="bangumi-info">
      <div class="bangumi-img-wrapper">
        <img class="bangumi-img" :src="bangumiInfo.thumb"/>
      </div>
      <div class="bangumi-other">
        <div class="b-item">
          <p>bangumiId：{{bangumiInfo.bangumiId}}</p>
        </div>
        <div class="b-item">
          <p>名称：{{bangumiInfo.bangumiName}}</p>
        </div>
        <div class="b-item">
          <p>总集数：{{bangumiInfo.episodeTotal}}</p>
        </div>
        <div>
          <p>播放数：{{bangumiInfo.viewCount}}</p>
        </div>
        <div class="b-item">
          <p>创建时间：{{formateDate(bangumiInfo.createTime)}}</p>
        </div>
        <div class="b-item">
          <p>修改时间: {{formateDate(bangumiInfo.modifyTime)}}</p>
        </div>
      </div>
    </div>
    <div class="episodes-container">
      <div class="episodes" v-for="episode in episodes" :key="episode.epId">
        <div class="episode">
          <el-button @click="handleClickEpIndex(episode)" size="mini">{{episode.epIndex}}</el-button>
        </div>
      </div>
      <div v-show="page.totalSize && page.totalSize >10" class="page-info">
        <div v-if="!loading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="page.pageNumber"
                         :page-sizes="[10,20,30, 50]" :page-size="page.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="page.totalSize">
          </el-pagination>
        </div>
      </div>
      <div v-if="curEpisodeInfo" class="episode-detail-wrapper">
        <div class="simple-ep-info">
          <p>
            <span>第{{curEpisodeInfo.epIndex}}集</span>
            <i @click="delEpisode(curEpisodeInfo.epId)" class="el-icon-delete del-ep-icon"></i>
          </p>
          <p>danmakuId: {{curEpisodeInfo.danmakuId}}</p>
          <p v-if="!editUrl">url: {{curEpisodeInfo.url}}</p>
          <p v-else>
            <el-input style="width: 400px" v-model="tempUrl"></el-input>
          </p>
          <div v-if="!editUrl" @click="handleEdit(curEpisodeInfo)" class="edit-wellcome">
            <i class="el-icon-edit edit-icon"></i>
          </div>
          <div v-else class="edit-wellcome">
            <i style="margin-right: 5px" @click="handleSave" class="el-icon-success save-icon"></i>
            <i @click="handleDiscard" class="el-icon-error discard-icon"></i>
          </div>
          <p>观看次数： {{curEpisodeInfo.viewCount}}</p>
          <p>{{curEpisodeInfo.replyable===1?'可评论':'禁止评论'}}</p>
          <p>创建：{{formateDate(curEpisodeInfo.createTime)}}</p>
          <p>修改：{{formateDate(curEpisodeInfo.modifyTime)}}</p>
          <p>评论数：{{episodeComm}}</p>
          <p>关联视频数：{{videos.length}}</p>
        </div>
        <div class="related-videos">
          <div v-for="video in videos" :key="video.videoId" class="r-video">
            <div @click="handelDelVideo(video.videoId)" class="v-operation">
              <i class="el-icon-delete v-del-icon"></i>
            </div>
            <p>videoId:
              <!--<el-tooltip class="item" effect="dark" :content="video.videoId" placement="top">-->
                <!--<span>{{video.videoId.substring(0,6)}}</span>-->
              <!--</el-tooltip>-->
                <span>{{video.videoId}}</span>
            </p>
            <p>vMD5:
              <el-tooltip class="item" effect="dark" :content="video.vMd5" placement="top">
                <span>{{video.vMd5.substring(0,6)}}</span>
              </el-tooltip>
            </p>
            <p>大小：{{(video.fileSize/1024/1024).toFixed(2)}}MB</p>
            <p>{{formateDate(video.createTime)}}</p>
            <p>{{video.isMatch===1?'已验证':'未验证'}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api"
  import util from "../../util/util"

  export default {
    name: "BangumiDetail",
    data() {
      return {
        editUrl: false,
        tempUrl: "",
        editViewCount: false,
        bangumiInfo: "",
        episodes: "",
        page: "",
        videos: "",
        episodeComm: 0,
        curEpisodeInfo: "",
        loading: true
      }
    },
    methods: {
      async updateEpisodeUrl(text) {
        if (text === "") {
          this.$message({
            message: "内容为空",
            type: "error"
          });
          return
        }
        this.curEpisodeInfo.url = text;
        let res = await API.editEpisode(this.curEpisodeInfo.epId, this.curEpisodeInfo);
        let rd = res.data;
        console.log("rd:", rd.data);
        if (rd.code === 0) {
          this.curEpisodeInfo.url = text;
          this.editUrl = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      },
      handleEdit() {
        this.editUrl = true;
        this.tempUrl = this.curEpisodeInfo.url;
      },
      handleSave() {
        this.updateEpisodeUrl(this.tempUrl);
      },
      handleDiscard() {
        this.editUrl = false;
      },
      async updateBangumiInfo(bid,bangumi){
        let res = await API.editBangumi(bid,bangumi);
        let rd = res.data;
        if(rd.code === 0){
          
        }
      },
      async getEpisodesByBangumiId(bid) {
        let res = await API.getEpisodesByBangumiId(bid, 1, 20);
        let rd = res.data;
        console.log("getEpisodesByBangumiId:", rd);
        if (rd.code === 0) {
          this.episodes = rd.data.episodes;
          this.page = rd.data.page;
          this.loading = false;
        }
      },
      async getBangumiById(bid) {
        let res = await API.getBangumiById(bid);
        let rd = res.data;
        console.log("getBangumiById:", rd);
        if (rd.code === 0) {
          this.bangumiInfo = rd.data;
        }
      },
      async getVideosByEid(eid) {
        let res = await API.getRelatedVideosByEpisodeId(eid, 1, 20);
        let rd = res.data;
        console.log("getVideosByEid:", rd);
        if (rd.code === 0) {
          this.videos = rd.data.videos;
        }
        else {
          console.log("err getting Videos...");
        }
      },
      async getNumOfCommentsByEid(eid) {
        let res = await API.getReplies(eid, 1);
        let rd = res.data;
        if (rd.code === 0) {
          this.episodeComm = rd.data.page.totalSize;
          console.log("episodeComm:", this.episodeComm);
        }
        else {
          console.log("err getting episodeComm...");
        }
      },
      handleClickEpIndex(episode) {
        this.curEpisodeInfo = episode;
        console.log("curEpisodeInfo:", this.curEpisodeInfo);
        this.getVideosByEid(episode.epId);
        this.getNumOfCommentsByEid(episode.epId);
        console.log("handle click epIndex!");
      },
      handelDelVideo(vid) {
        console.log("del video:", vid);
        this.$confirm("确定要删除该视频？", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action) => {
            if (action === "confirm") {
              let res = await API.deleteVideo(vid);
              let rd = res.data;
              console.log("delete video result:", rd);
              if (rd.code === 0) {
                this.videos = this.videos.filter(t => t.videoId != vid);
                this.$message({
                  showClose: true,
                  message: "已删除",
                  type: "success"
                });
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
        return util.formateDate(ts);
      },
      async handleSizeChange(val) {
        console.log("每页" + val + "条");
        let res = await API.getEpisodesByBangumiId(this.bangumiInfo.bangumiId, 1, val);
        let rd = res.data;
        console.log(rd);
        if (rd.code === 0) {
          this.episodes = rd.data.episodes;
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
        let res = await API.getEpisodesByBangumiId(this.bangumiInfo.bangumiId, val, this.page.pageSize);
        let rd = res.data;
        console.log(rd);
        if (rd.code === 0) {
          this.episodes = rd.data.episodes;
          this.page = rd.data.page;
        } else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      },
      async delEpisode(eid) {
        console.log("delEpisode:", eid);
        this.$confirm("确定要删除该集？", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action) => {
            if (action === "confirm") {
              let res = await API.deleteEpisode(eid);
              let rd = res.data;
              if (rd.code === 0) {
                this.curEpisodeInfo = "";
                this.videos = "";
                this.episodes = this.episodes.filter(t => t.epId != eid);
                this.$message({
                  showClose: true,
                  message: "已删除",
                  type: "success"
                });
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
      }
    },
    created() {
      let bid = this.$route.params.bid;
      console.log("bid:", bid);
      if (bid) {
        this.getBangumiById(bid);
        this.getEpisodesByBangumiId(bid);
      }
      else {
        console.log("未获取到bangumiId");
      }
    }
  }
</script>

<style scoped>
  .bangumi-info {
    height: 220px;
    margin-bottom: 20px;
    border-bottom: 1px solid #303133;
  }

  .bangumi-img-wrapper {
    width: 320px;
    height: 180px;
    float: left;
  }

  .bangumi-img {
    width: 320px;
    height: 180px;
  }

  .bangumi-other {
    margin-left: 330px;
  }

  .page-info {
    margin-top: 20px;
  }

  .episodes {
    display: inline-block;
  }

  .episode {
    margin-right: 5px;
    margin-bottom: 5px;
  }

  .episode-detail-wrapper {
    margin-top: 20px;
    border-top: 1px solid #303133;
  }

  .v-operation {
    float: right;
    color: #cccccc;
  }

  .related-videos {
    display: inline-block;
  }

  .r-video {
    border: 1px solid;
    padding: 5px;
    width: 210px;
    height: 190px;
    margin: 10px;
    display: inline-block;
  }

  .del-ep-icon {
    color: #ab4b4b;
    margin-left: 13px;
  }

  .edit-wellcome {
    display: inline-block;
    margin-left: 20px;
  }
</style>