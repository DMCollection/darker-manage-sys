<template>
  <div class="report-container">
    <div>
      <el-button @click="initReport" type="primary">
        刷新
      </el-button>
    </div>
    <div>
      <div class="report-entity" v-for="(report,index) in reports" :key="report.id">
        <div class="rp-operation">
          <el-button @click="clickApprove(report.id,index)" type="primary">
            采纳
          </el-button>
          <el-button @click="clickDeny(report.id,index)" type="">
            否决
          </el-button>
        </div>
        <p>handledTime:{{report.handledTime}}</p>
        <p>createTime:{{new Date(report.createTime).toDateString()}}</p>
        <p>handleStatus:{{report.handleStatus}}</p>
        <p>publisherUserId:{{report.publisherUserId}}</p>
        <p>targetType:{{report.targetType}}</p>
        <p>managerId:{{report.managerId}}</p>
        <p>id: {{report.id}}</p>
        <p>content: {{report.content}}</p>
        <p>reportReason: {{report.reportReason}}</p>
      </div>
    </div>

    <div v-if="page" class="pagination">
        <el-pagination @current-change="handleCurrentChange"
                       :current-page.sync="page.pageNumber"
                       layout="total, prev, pager, next, jumper" :total="page.totalSize">
        </el-pagination>
    </div>

    <el-dialog title="处理理由选择" width="400" :visible.sync="showReportBox">
      <el-radio-group v-model="reportType">
        <div>
          <el-radio :label=1>辱骂</el-radio>
          <el-radio :label=2>色情</el-radio>
          <el-radio :label=3>垃圾广告</el-radio>
          <el-radio :label=4>引战</el-radio>
        </div>
        <div style="margin-top: 20px">
          <el-radio :label=5>剧透</el-radio>
          <el-radio :label=6>人身攻击</el-radio>
          <el-radio :label=7>隐私侵犯</el-radio>
          <el-radio :label=8>刷屏</el-radio>
        </div>
        <div style="margin-top: 20px">
          <el-radio :label=9>违法违规</el-radio>
          <el-radio :label=10>低俗</el-radio>
          <el-radio :label=11>赌博诈骗</el-radio>
          <el-radio :label=12>其他</el-radio>
        </div>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReport">取消</el-button>
        <el-button :disabled="reportType === ''" type="primary" @click="handleReport">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import API from "../../api/api"
  import util from "../../util/util"
  export default {
    name: "ReportList",
    data(){
      return {
        reports: "",
        page: "",
        showReportBox: false,
        handleType: "",
        reportType: "",
        reportId: "",
        index: ""
      }
    },
    methods:{
      async initReport(){
        let res = await API.getReorts(1,20,1);
        let rd = res.data;
        if(rd.code === 0){
          this.reports = rd.data.reports;
          this.page = rd.data.page;
        }
      },
      async handleReport(){
        let res = await API.handleReport(this.reportId,{
          handleType: this.handleType,
          reportReason: this.reportType
        });
        let rd = res.data;
        if(rd.code === 0){
          this.$message({
            message: "处理成功",
            type: "success"
          });
          this.reports.splice(this.index,1);
          this.initReport();
          this.showReportBox = false;
        }
        else {
          this.$message({
            message: rd.msg,
            type: "error"
          });
        }
      },
      async handleCurrentChange(val){
        let res = await API.getReorts(val,20,"");
        let rd = res.data;
        if(rd.code === 0){
          this.reports = rd.data.reports;
          this.page = rd.data.page;
        }
      },
      clickApprove(id,index){
        this.reportId = id;
        this.handleType = 3;
        this.showReportBox = true;
        this.index = index;
      },
      clickDeny(id,index){
        this.reportId = id;
        this.handleType = 2;
        this.index = index;
        this.showReportBox = true;
      },
      cancelReport(){
        this.reportType = "";
        this.handleType = "";
        this.reportId = "";
        this.index = "";
        this.showReportBox = false;
      }
    },
    created(){
      this.initReport();
    }
  }
</script>

<style scoped>
  .rp-operation {
    float: right;
  }
  .report-entity {
    margin: 10px;
    padding: 10px;
    display: inline-block;
    width: 400px;
    height: 400px;
    border: 1px solid white;
  }
</style>