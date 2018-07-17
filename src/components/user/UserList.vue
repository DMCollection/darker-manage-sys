<template>

  <div class="user-container">
  <div class="filter-container">
    <el-input  style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" placeholder="用户昵称" v-model="query.nick">
    </el-input>
    <el-button class="filter-item" style="margin-left:10px" circle type="primary" icon="el-icon-search" @click="handleSearch"></el-button>
    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="showAddUserDialog = true">添加</el-button>
    <el-button class="filter-item" type="primary" icon="el-icon-delete">批量删除</el-button>
    <el-button class="filter-item" type="primary" @click="getUsersList">显示有用户</el-button>
  </div>


  <el-table height='600' ref="multipleTable" :data="list" element-loading-text="loading..." border style="width: 100%" highlight-current-row  >
    <el-table-column type="selection" width="35">
    </el-table-column>


    <el-table-column label="用户名" width="150">
      <template slot-scope="scope">
        <div class="nick-link">
          <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
            <div class="short-user-info">
              <div class="u-avatar-wrapper">
                <img class="u-avatar-img" :src="scope.row.face"/>
              </div>
              <div class="u-other-info">
                <span class="user-nick-link">
                  <a target="_blank" :href="'#/home/userdetail/'+scope.row.userId">
                    {{scope.row.nick}}
                  </a>
                </span>
                <span>
                  {{scope.row.sex}}
                </span>
                <span>
                  {{scope.row.age}}
                </span>
                <span>
                  {{scope.row.role}}
                </span>
              </div>
            </div>
            <a slot="reference" target="_blank" :href="'#/home/userdetail/'+scope.row.userId">
              {{scope.row.nick}}
            </a>
          </el-popover>
        </div>
      </template>
    </el-table-column>

    <el-table-column
            prop="role"
            :filters="roles"
            :filter-method="roleFilter"
            label="角色"  width="150">
      <template slot-scope="scope">
        <el-button type="success" @click="changeRole(scope.row,1)" v-if="scope.row.role === 'ROLE_USER'" size="small">提升为管理员</el-button>
        <el-button type="info" @click="changeRole(scope.row,2)" v-if="scope.row.role ==='ROLE_MANAGER'" size="small">提升为系统管理员</el-button>
        <el-button type="warning" @click="changeRole(scope.row,0)" v-if="scope.row.role === 'ROLE_ADMIN'" size="small">撤销管理员</el-button>
      </template>
    </el-table-column>

    <el-table-column align="center"  label="注册时间" width="180" >
      <template slot-scope="scope">
        <!-- <i class="el-icon-time"></i> -->
        <span>{{formateData(scope.row.createTime)}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center"  label="邮箱" width="200">
      <template slot-scope="scope">
        <!-- <i class="el-icon-time"></i> -->
        <span>{{scope.row.email}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center"  label="锁定" width="80">
      <template slot-scope="scope">
        <!-- <i class="el-icon-time"></i> -->
        <span>{{scope.row.isLock===1?'是':'否'}}</span>
        <el-button type="success" v-if="scope.row.isLock === 1" @click="unlockUser(scope.row)" size="small">解封</el-button>
        <el-button type="warning" v-if="scope.row.isLock === 0" @click="lockUser(scope.row)" size="small">封禁</el-button>

      </template>
    </el-table-column>
    <el-table-column align="center"  label="锁定时长(m)" width="150">
      <template slot-scope="scope">
        <span>{{scope.row.lockTime}}</span>
      </template>
    </el-table-column>

    <el-table-column
            prop="sex"
            :filters="[{text: '男', value: '男'}, {text: '女', value: '女'}, {text: '不明', value: '不明'}]"
            :filter-method="sexFilter"
            align="center" label="性别" width="80">
      <template slot-scope="scope">
        <span >{{scope.row.sex}}</span>
      </template>
    </el-table-column>

    <el-table-column label="年龄"  align="center" width="80">
      <template slot-scope="scope">
        {{scope.age}}
      </template>
    </el-table-column>

    <el-table-column fixed="right" align="center"  label="操作" width="120">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row.userId, scope.row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index,scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.pageNumber"
                   :page-sizes="[10,20,30, 50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalSize">
    </el-pagination>
  </div>
  <!-- 新增弹窗 -->
  <el-dialog title="添加用户" :visible.sync="showAddUserDialog">
    <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>

      <el-form-item label="昵称">
        <el-input v-model="temp.nick"></el-input>
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="temp.email"></el-input>
      </el-form-item>

      <el-form-item label="电话">
        <el-input v-model="temp.phone"></el-input>
      </el-form-item>

      <el-form-item label="年龄">
        <el-input v-model="temp.age"></el-input>
      </el-form-item>


    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="showAddUserDialog = false">取 消</el-button>

      <el-button type="primary" @click="handleAddUser">确 定</el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
  import API from "../../api/api"
  import util from "../../util/util"
  export default {
    name: "UserList",
    data() {
      return {
        list: [],
        page: {},
        query: {
          nick: "",
          lastQuery: ""
        },
        temp: {
          nick: "",
          email: "",
          phone: "",
          age: ""
        },
        showAddUserDialog: false,
        listLoading: true,
        roles: [
          { text: "普通用户", value: "ROLE_USER" },
          { text: "管理员", value: "ROLE_ADMIN" },
          { text: "系统管理员", value: "ROLE_MANAGER" }
        ],
        checkList: []
      };
    },
    mounted() {
      console.log("mounted! getUserList...");
      this.getUsersList();
    },
    methods: {
      test(){
        console.log("click username!");
      },
      //获取所有用户信息
      async getUsersList() {
        this.listLoading = true;
        let data = this.$route.query;
        console.log("获取到url参数：", data);
        //根据url中的参数，进行ajax获取表单数据
        let res = await API.getUsers(1,20);
        console.log("getUsers result:");
        console.log(res);
        let rd = res.data;
        if (rd.code === 0) {
          this.list = rd.data.users;
          this.page = rd.data.page;
          this.query.lastQuery = "";
          console.log("获取所有用户:", rd.data.users);
          console.log("分页信息：", rd.data.page);
        } else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
        this.listLoading = false;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      formateData(ts){
        return util.formateDate(ts);
      },
      handleEdit(userId, user) {
        console.log("userId:" + userId);
        console.log(user);
        console.log("edit row invoked!");
      },
      async handleDelete(index, user) {
        console.log("userId to be deleted:" + user.userId);
        let del = false;
        this.$confirm("删除用户：" + user.nick, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            if (action === "confirm") {
              console.log("del:" + del);
              console.log(instance);
              let res = await API.deleteUser(user.userId);
              if (res.data.code === 0) {
                console.log("删除成功，uid:" + user.userId);
                console.log("index:" + index);
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
                this.list.splice(index, 1);
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              }
            } else {
              this.$message({
                showClose: true,
                message: "已取消删除",
                type: "info"
              });
            }
          }
        });
      },
      async handleSearch() {
        console.log("search nick:" + this.query.nick);
        if (this.query.nick === "") {
          this.$message({
            showClose: true,
            message: "请输入搜索内容",
            type: "info"
          });
          return;
        }
        let res = await API.searchUsersByNick(this.query.nick,1,20);
        let rd = res.data;
        if (rd.code === 0) {
          this.list = rd.data.users;
          this.page = rd.data.page;
          this.query.lastQuery = this.query.nick;
          if (rd.data.users.length === 0) {
            this.$message({
              showClose: true,
              message: "无搜索结果",
              type: "info"
            });
          }
        } else {
          this.list = [];
          this.page.totalSize = 0;
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "info"
          });
        }
      },
      async handleSizeChange(val) {
        console.log("每页" + val + "条");
        let res;
        if(this.query.lastQuery!==""){
          res = await API.searchUsersByNick(this.query.lastQuery,1,val);
        }
        else{
          res = await API.getUsers(1, val);
        }
        let rd = res.data;
        console.log(rd);
        if (rd.code === 0) {
          this.list = rd.data.users;
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
        let res;
        if(this.query.lastQuery!==""){
          res = await API.searchUsersByNick(this.query.lastQuery,val,this.page.pageSize);
        }
        else{
          res = await API.getUsers(val,this.page.pageSize);
        }
        let rd = res.data;
        console.log(rd);
        if (rd.code === 0) {
          this.list = rd.data.users;
          this.page = rd.data.page;
        } else {
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "error"
          });
        }
      },
      handleAddUser() {},
      roleFilter(value, row) {
        console.log("value:" + value);
        console.log("row.role:" + row.role);
        console.log(row.role === value);
        return row.role === value;
      },
      sexFilter(value, row) {
        return row.sex === value;
      },
      lockUser(row) {
        console.log("lockUser!");
        console.log(row);
        this.$prompt("封禁时长：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            if (action === "confirm") {
              console.log("封禁时间：" + instance.inputValue);
              let res = await API.lockUser(
                  row.userId,
                  1,
                  instance.inputValue
              );
              let rd = res.data;
              console.log(rd);
              if (rd.code === 0) {
                row.isLock = 1;
                this.$message({
                  showClose: true,
                  message: rd.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: "封禁用户失败",
                  type: "error"
                });
              }
            } else {
              this.$message({
                showClose: true,
                message: "已取消",
                type: "info"
              });
            }
          }
        });
      },
      async unlockUser(row) {
        console.log("unlockUser!");
        let res = await API.unlockUser(row.userId);
        let rd = res.data;
        console.log("unlock res:",rd);
        if (rd.code === 0) {
          row.isLock = 0;
          this.$message({
            showClose: true,
            message: rd.msg,
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: "解封用户失败",
            type: "error"
          });
        }
      },
      async changeRole(row, roleId) {
        console.log("changle role!");
        console.log(row);
        this.$prompt("请输入密码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async (action, instance) => {
            if (action === "confirm") {
              console.log("密码：" + instance.inputValue);
              let res = await API.changeUserRole(row.userId,roleId,instance.inputValue);
              let rd = res.data;
              console.log(rd);
              if (rd.code === 0) {
                if (roleId === 0) {
                  row.role = "ROLE_USER";
                } else if (roleId === 1) {
                  row.role = "ROLE_MANAGER";
                } else {
                  row.role = "ROLE_ADMIN";
                }
                this.$message({
                  showClose: true,
                  message: rd.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: rd.msg,
                  type: "error"
                });
              }
              this.$message({
                showClose: true,
                message: rd.msg,
                type: "success"
              });
            } else {
              this.$message({
                showClose: true,
                message: "已取消",
                type: "info"
              });
            }
          }
        });
      }
    }
  }
</script>

<style scoped>
.nick-link a:hover {
  cursor: pointer;
}
  .u-avatar-wrapper {
    width: 58px;
    height: 58px;
    display: inline-block;
    margin-left: 10px;
  }
  .u-avatar-img {
    width: 58px;
    height: 58px;
    border-radius: 58%;
    display: inline-block;
  }
  .u-other-info {
    display: inline-block;
  }
</style>