<template>
  <div class="log-container">
    <div class="log-operation">
      <el-button :disabled="intervalId===''" @click="stopWatch" type="primary">停止监控</el-button>
      <el-button :disabled="intervalId !== '' " @click="startWatch" type="primary">开始监控</el-button>
      <el-button @click="showFullLogs" type="primary">显示完整日志</el-button>
      <el-button @click="shutDownApp" type="danger">关闭应用</el-button>
    </div>
    <div class="log-area">
      <div class="log-entity" v-for="(log,index) in logs" :key="index">
        <p class="log-text">{{log}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api"
  export default {
    name: "SystemLog",
    data(){
      return {
        logs: "",
        logsFull: "",
        intervalId: ""
      }
    },
    methods: {
      async getLogs(){
        let res = await API.getLogs();
        let rd = res.data;
        if(rd){
          let tmpLogs = rd.split("\n");
          if(tmpLogs.length > 0){
            //存储完整的日志到logsFull
            // this.logsFull = tmpLogs.slice(0);
            //取最后5000条日志展示
            this.logs = tmpLogs.splice(tmpLogs.length<50?0:tmpLogs.length-50);
          }
        }
      },
      stopWatch(){
        if(this.intervalId){
          clearInterval(this.intervalId);
          this.intervalId = "";
          console.log("stop watching success");
        }
      },
      startWatch(){
        if(this.intervalId === ""){
          this.intervalId = setInterval(() => {
            this.getLogs();
          }, 10000);
          console.log("start watching success");
        }
      },
      async showFullLogs(){
        this.logs = ";"
        if(this.intervalId){
          clearInterval(this.intervalId);
          this.intervalId = "";
          console.log("show full log and stop watching success");
        }
        let res = await API.getLogs();
        let rd = res.data;
        if(rd){
          let tmpLogs = rd.split("\n");
          if(tmpLogs.length > 0){
            this.logs = tmpLogs;
          }
        }
      },
      async shutDownApp(){
        this.$confirm("确定关闭应用？关闭后无法从这里重新启动：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            console.log(instance);
            if (action === "confirm") {
              let res = await API.shutDownApp();
              let rd = res.data;
              console.log("shutDown: ",rd);
              if(rd){
                this.$message({
                  message: "已关闭",
                  type: "success"
                });
              }
              }
            }
        });
      }
    },
    created(){
      this.getLogs();
      this.intervalId = setInterval(() => {
        this.getLogs();
      }, 2000);
    },
    beforeDestroy() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = "";
      }
    }
  }
</script>

<style scoped>
  .log-operation {
    position: fixed;
    top: 70px;
  }
  .log-area {
    margin-top: 50px;
  }
  .log-text:hover {
    background-color: aliceblue;
  }

</style>