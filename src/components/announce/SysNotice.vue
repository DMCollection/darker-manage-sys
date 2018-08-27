<template>
  <div class="sys-notice">
    <div class="sn-operation">
      <el-button @click="initSysNotice" type="primary">刷新系统消息</el-button>
      <el-button @click="sendByType = true" type="primary">发送给特定群体</el-button>
      <el-button @click="sendByIds= true" type="primary">发送给特定用户</el-button>
    </div>
    <div class="sn-list">
      <div v-for="(notice,index) in notices" :key="notice.id" class="notice">
        <div class="n-operation">
          <el-button :disabled="notice.status==='DELETE'"
                     @click="deleteSysNotice(notice.id,index)"
                     type="danger" icon="el-icon-delete" circle>
          </el-button>
        </div>
        <div class="n-title">{{notice.title}}</div>
        <div v-html="notice.content" class="n-content"></div>
        <div class="n-misc">
          <span>id:{{notice.id}}</span>
          <span>publisherUid:{{notice.publisherUid}}</span>
          <span>sysMsgTargetType:{{notice.sysMsgTargetType}}</span>
          <span>status:{{notice.status}}</span>
          <span>ctime:{{new Date(notice.createTime).toDateString()}}</span>
        </div>
      </div>
      <div v-if="page && notices.length>0" class="pagination">
        <el-pagination
          v-if="page.totalSize>50"
          @current-change="pageSelect"
          :current-page.sync="page.pageNumber"
          :page-count="11"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="page.totalSize">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="发送公告给某一群体" :before-close="cancelSendInfo" :visible.sync="sendByType">
      <el-form class="small-space" :model="byType" label-position="left" label-width="70px" style='margin-left:50px;'>

        <el-form-item label="type">
          <el-select v-model="byType.type" placeholder="请选择群体">
            <el-option label="用户" value=0></el-option>
            <el-option label="管理员" value=1></el-option>
            <el-option label="系统管理员" value=2></el-option>
            <el-option label="全部" value=3></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="byType.title"></el-input>
        </el-form-item>

        <el-form-item label="内容">
          <el-input v-model="byType.content"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSendByType">取 消</el-button>

        <el-button type="primary" @click="sendSysNoticeByType">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="发送公告给特定用户" :before-close="cancelSendInfo" :visible.sync="sendByIds">
      <el-form class="small-space" :model="byIds" label-position="left" label-width="70px" style='margin-left:50px;'>

        <el-form-item label="ids">
          <el-input v-model="byIds.ids"></el-input>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="byIds.title"></el-input>
        </el-form-item>

        <el-form-item label="内容">
          <el-input v-model="byIds.content"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSendByIds">取 消</el-button>

        <el-button type="primary" @click="sendSysNoticeByIds">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api";
  export default {
    name: "SysNotice",
    data(){
      return {
        notices: [],
        byIds: {
          ids: "",
          title: "",
          content: ""
        },
        byType: {
          type: "",
          title: "",
          content: ""
        },
        sendByIds: false,
        sendByType: false,
        page: ""
      }
    },
    methods:{
      async initSysNotice(){
        let res = await API.getSystemNotice(1,50);
        let rd = res.data;
        if(rd.code === 0){
          this.notices = rd.data.messages;
          this.page = rd.data.page;
        }
        else {
          console.log("init system notice err.")
        }
      },
      async pageSelect(val){
        let res = await API.getSystemNotice(val,this.page.pageSize);
        let rd = res.data;
        if(rd.code === 0){
          this.notices = rd.data.messages;
          this.page = rd.data.page;
        }
        else {
          console.log("page select err..")
        }
      },
      async sendSysNoticeByType(){
        if((!this.byType.type && this.byType.type !== 0) || !this.byType.title || !this.byType.content){
          return
        }
        if(this.byType.type == 3){
          console.log("type == 3");
          let res1 = await API.sendSystemNoticeByType(0,this.byType.title,this.byType.content);
          let res2 = await API.sendSystemNoticeByType(1,this.byType.title,this.byType.content);
          let res3 = await API.sendSystemNoticeByType(2,this.byType.title,this.byType.content);
          let rd1 = res1.data;
          let rd2 = res2.data;
          let rd3 = res3.data;
          if(rd1.code === 0 && rd2.code === 0 && rd3.code === 0){
            this.notices.unshift(rd1.data);
            this.notices.unshift(rd2.data);
            this.notices.unshift(rd3.data);
            this.sendByType = false;
            this.$message({
              message: "发送成功",
              type: "success"
            });

          }
          else {
            console.log("send system notice to all err...");
            this.$message({
              message: "发送失败",
              type: "error"
            });
          }
          return
        }
        let res = await API.sendSystemNoticeByType(this.byType.type,this.byType.title,this.byType.content);
        let rd = res.data;
        if(rd.code === 0){
          this.notices.unshift(rd.data);
          console.log("notice res: ",rd.data);
          this.sendByType = false;
          this.$message({
            message: "发送成功",
            type: "success"
          });
        }
        else {
          console.log("send notice err");
          this.$message({
            message: rd.msg,
            type: "error"
          });
        }
      },
      async sendSysNoticeByIds(){
        if(!this.byIds.ids || !this.byIds.title || !this.byIds.content){
          return
        }
        let tmp = this.byIds.ids.split(",");
        tmp.pop();
        console.log("tmp:",tmp);
        let ids = tmp.map((val)=>{
          return parseInt(val);
        });
        console.log("ids:",ids);
        let res = await API.sendSystemNoticeByIds(ids,this.byIds.title,this.byIds.content);
        let rd = res.data;
        if(rd.code === 0){
          // this.notices.unshift(rd.data);
          let tmpRes = {
            "id": rd.data,
            "title": this.byIds.title,
            "content": this.byIds.content,
            "createTime": new Date().toDateString(),
            "status": "NORMAL",
            "publisherUid": localStorage.getItem("uid"),
            "sysMsgTargetType": "给特定用户"
          };
          console.log("tmpRes:",tmpRes);
          this.notices.unshift(tmpRes);
          this.sendByIds = false;
          this.$message({
            message: "发送成功",
            type: "success"
          });
        }
        else {
          console.log("send notice err...");
          this.$message({
            message: rd.msg,
            type: "error"
          });
        }
      },
      async deleteSysNotice(id,index){
        this.$confirm("删除系统消息：" + id, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            console.log(instance);
            if (action === "confirm") {
              let res;
              if(typeof id === 'number'){
                res = await API.deleteSystemNotice(id);
              }
              else {
                res = await API.deleteIdsSystemNotice(id);
              }
              let rd = res.data;
              if(rd.code === 0){
                this.notices.splice(index,1);
                this.$message({
                  message: "通知已被删除",
                  type: "success"
                });
              }
              else {
                console.log("del system notice err.");
                this.$message({
                  message: "删除失败",
                  type: "error"
                });
              }
            }
          }
        });
      },
      cancelSendByType(){
        this.byType.type = "";
        this.byType.content = "";
        this.byType.title = "";
        this.sendByType = false;
      },
      cancelSendByIds(){
        this.byIds.ids = "";
        this.byIds.title = "";
        this.byIds.content = "";
        this.sendByIds = false;
      },
      cancelSendInfo(done){
        this.byType.type = "";
        this.byType.content = "";
        this.byType.title = "";
        this.byIds.ids = "";
        this.byIds.title = "";
        this.byIds.content = "";
        this.sendByType = false;
        this.sendByIds = false;
        done();
      }
    },
    created(){
      this.initSysNotice();
    }
  }
</script>

<style scoped>
  .n-misc span {
    margin-right: 5px;
  }
  .notice {
    border: 1px solid wheat;
    margin-bottom: 20px;
    padding: 10px;
  }
  .sn-operation {
    margin-bottom: 20px;
  }
  .n-title {
    color: aliceblue;
    margin-bottom: 10px;
  }
  .n-content {
    margin-bottom: 10px;
  }
  .n-misc {
    color: #c3bebe;
  }
  .n-operation {
    float: right;
  }
</style>