<template>
  <div class="announce-prev">
    <div class="page-container">
      <div class="title-container">
        <h1>{{title}}</h1>
        <div>
          <span ><i class="el-icon-date" title="发布时间" style="padding-right: 5px"></i>8102/12/23 12:00</span>
          <span style="margin-left: 15px"><i class="el-icon-view" title="阅读量" style="padding-right: 5px"></i>233</span>
        </div>
      </div>
      <div class="content-container">
        <div class="ctx-text" v-html="content">
        </div>
      </div>
      <div class="comment-container">

      </div>
      <div class="bottom-container">

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AnnouncePreview",
    data(){
      return {
        title: "",
        content: ""
      }
    },
    created(){
      this.title = sessionStorage.getItem("annTitle");
      this.content = sessionStorage.getItem("annContent");
      console.log("title:",this.title);
      console.log("content:",this.content);

    }
  }
</script>
<style scoped>
  .announce-prev {
    text-align: center;
  }
  .title-container {
    margin: 20px 0 60px 0;
  }
  .title-container div {
    margin-bottom: 10px;
  }
  .page-container {
    text-align: left;
    width: 800px;
    display: inline-block;
    margin-top: 60px;
  }
  .content-container {
    margin-bottom: 20px;
  }
  .page-container .title-container, .page-container .content-container,
  .page-container .comment-container, .page-container .bottom-container {
    padding: 0 20px;
  }
  .title-container h1 {
    font-weight: 600;
    font-size: 26px;
    line-height: 30px;
  }
</style>

<style>
  .content-container .ctx-text img {
    max-width: 760px;
  }
</style>