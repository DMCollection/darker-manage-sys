<template>
  <div class="announce-post">
    <div class="announce-inner">
      <div class="announce-wrap">
        <div class="announce-title">
        <textarea class="announce-text-area"
                  maxlength="40"
                  v-model="title"
                  placeholder="请输入标题（建议30字以内）"
                  style="overflow-y: hidden; height: 104px;">

        </textarea>
          <span class="title-count">
          {{titleWord}}/40
        </span>
        </div>
        <div class="editor">
          <quill-editor v-model="content"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)">
          </quill-editor>
        </div>
        <div>
          <span style="display:inline-block;color: #717171;margin-right:10px;">在首页显示</span>
          <el-switch
                  v-model="showInMP"
                  active-color="#3a86ef"
                  inactive-color="#777">
          </el-switch>
        </div>
      </div>
      <div class="post-announce-botton">
        <el-button type="primary" @click="postAnnounce">发布</el-button>
        <el-button @click="preview">预览</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api"
  import {quillEditor, Quill} from 'vue-quill-editor'
  import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  Quill.register('modules/ImageExtend', ImageExtend);

  export default {
    name: "AnnouncePost",
    data() {
      return {
        content: "",
        editorOption: {
          placeholder: '请输入内容',
          modules: {
            ImageExtend: {  // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入
              name: 'image',  // 图片参数名
              size: 10,  // 可选参数 图片大小，单位为M，1M = 1024kb
              action: this.GLOBAL.uploadURL,  // 服务器地址, 如果action为空，则采用base64插入图片
              response: (res) => {
                let link = res.data.link;
                link = link.substring(link.lastIndexOf('/'));
                console.log("link:", link);
                let imgURL = this.GLOBAL.imgURL + link;
                console.log("imgURL:", imgURL);
                return imgURL;
              },
              headers: (xhr) => {
                xhr.setRequestHeader("Authorization", "Client-ID 3855bbe9883a511")
              },  // 可选参数 设置请求头部
              sizeError: () => {
                this.$message({
                  showClose: true,
                  message: "图片大小不能超过10MB",
                  type: "error"
                });
              }
            },
            toolbar: {  // 如果不上传图片到服务器，此处不必配置
              container: container,  // container为工具栏，此次引入了全部工具栏，也可自行配置
              handlers: {
                'image': function () {  // 劫持原来的图片点击按钮事件
                  QuillWatch.emit(this.quill.id)
                }
              }
            }
          }
        },
        title: "",
        showInMP: false,
        editMode: false,
        editAnnounce: ""
      }
    },
    components: {quillEditor},
    methods: {
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
      async postAnnounce() {
        console.log("post notice");
        if (this.editMode) {
          let notice = {
            title: this.title,
            content: this.content,
            isi: this.showInMP ? 1 : 0,
            nid: this.editAnnounce.id
          };
          if (this.title !== '' && this.content !== '') {
            let res = await API.editNotice(notice);
            let rd = res.data;
            console.log(rd);
            if (rd.code === 0) {
              this.$message({
                message: "修改成功",
                type: "success"
              })
            }
            else {
              this.$message({
                message: rd.msg,
                type: "error"
              })
            }
          }
          else {
            this.$message({
              message: "请填写标题/内容",
              type: "error"
            })
          }
        }
        else {
          let notice = {
            title: this.title,
            content: this.content,
            isi: this.showInMP ? 1 : 0
          };
          if (this.title !== '' && this.content !== '') {
            let res = await API.postNotice(notice);
            let rd = res.data;
            console.log(rd);
            if (rd.code === 0) {
              this.$message({
                message: "发表成功",
                type: "success"
              })
            }
            else {
              this.$message({
                message: rd.msg,
                type: "error"
              })
            }
          }
          else {
            this.$message({
              message: "请填写标题/内容",
              type: "error"
            })
          }
        }
      },
      preview() {
        console.log("preview!");
        let routeData = this.$router.resolve({name: 'annpreview'});
        sessionStorage.setItem("annTitle", this.title);
        sessionStorage.setItem("annContent", this.content);
        console.log("href:", routeData.href);
        window.open(routeData.href, '_blank');
      }
      // onEditorChange({ quill, html, text }) {
      //   console.log('editor change!', quill, html, text)
      //   this.content = html
      // }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      },
      titleWord() {
        return this.title.length;
      }
    },
    mounted() {
      // console.log('this is current quill instance object', this.editor)
    },
    created() {
      let announce = this.$route.params.announce;
      console.log("get announce from param:", announce);
      if (announce) {
        this.editMode = true;
        this.editAnnounce = announce;
        this.title = announce.title;
        this.content = announce.content;
      }
    }
  }
</script>

<style scoped>
  .announce-post {
    text-align: center;
  }

  .announce-inner {
    text-align: left;
    border-radius: 5px;
  }

  .announce-wrap {
    width: 100%;
    margin-bottom: 20px;
    border-bottom: 1px solid white;
  }

  .announce-title {
    position: relative;
    width: 100%;
    margin-bottom: 18px;
    border: none;
    padding: 0;
  }

  .announce-text-area {
    display: block;
    height: 64px;
    word-break: break-all;
    border: 0;
    font-size: 28px;
    padding: 12px 10px 12px 10px;
    font-weight: 700;
    line-height: 40px;
    background-color: transparent;
    outline: none;
    resize: none;
    text-align: justify;
    width: 740px;
  }

  .title-count {
    position: absolute;
    top: 50%;
    margin-top: -9px;
    right: 5px;
    text-align: right;
    width: 40px;
    color: #99a2aa;
  }

  .post-announce-botton {
    width: 100%;
    margin: 10px;
  }

</style>
<style>
  .announce-inner {
    width: 800px;
    color: black;
    background-color: white;
    display: inline-block;
  }

  .ql-container.ql-snow {
    min-height: 300px;
  }
</style>
