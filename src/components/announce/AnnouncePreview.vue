<template>
  <div class="announce-prev">
    <div class="page-container">
      <div class="title-container">
        <h1>{{title}}</h1>
        <div><span>发布时间：8102/02/22</span></div>
      </div>
      <div class="content-container">
        <div class="ctx-text" v-html="content">
        </div>
      </div>
      <div class="comment-container">
        COMMENT
      </div>
      <div class="bottom-container">
        底部ggg
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
    border-bottom: 1px solid white;
    margin: 20px 0;
  }
  .title-container div {
    margin-bottom: 10px;
  }
  .page-container {
    text-align: left;
    width: 800px;
    display: inline-block;
    border: 1px solid white;
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