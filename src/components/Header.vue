<template>
  <div slot-scope="" style="margin-top: 13px; margin-left: 20px">
    <div style="float:left;margin-top: 10px;">
      <span>📕</span>
      <strong> {{ pageTitle }}</strong>
    </div>
    <div class="info">
      <el-button
        @click="toShare"
        type="primary"
        v-show="!isSharePage"
        size="small"
        style="margin-right: 20px;"
        >共享页面</el-button
      >
      <el-dropdown @command="handleCommand" v-if="userName !== null">
        <span class="el-dropdown-link">
          欢迎{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
          <el-dropdown-item command="notice" style="text-align: center;">
            <el-badge :is-dot="noticeUnReader" class="item">
              通知
            </el-badge>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-else
        @click="login"
        style="padding-bottom:8px;padding-top:8px"
        type="primary"
        >登录</el-button
      >
    </div>
    <div v-show="userName !== null">
      <el-button
        size="small"
        type="primary"
        class="scheduleBtn"
        @click="openScheduleCard"
        >编辑计划表</el-button
      >
      <div class="scheduleStyle">
        <el-descriptions
          :column="3"
          size="small"
          border
          style="width: 600px;float: left; padding-bottom: 5px;"
        >
          <el-descriptions-item label="最近需完成计划" size="small">
            {{ recentPlan.plan }}
          </el-descriptions-item>
          <el-descriptions-item label="完成时间">
            {{ recentPlan.finishTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <el-card class="box-card" v-show="openSchedule">
      <div slot="header" class="clearfix">
        <span>编辑计划表</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="openSchedule = false"
          ><div class="el-icon-close"></div
        ></el-button>
        <div class="boxCardBtn">
          <el-button
            class="unfinishBtnStyle"
            v-bind:class="{
              curScheduleStyleBtn: ScheduleStatus === 0
            }"
            @click="ScheduleStatus = 0"
            >未完成</el-button
          >
          <el-button
            class="finishBtnStyle"
            v-bind:class="{
              curScheduleStyleBtn: ScheduleStatus === 1
            }"
            @click="ScheduleStatus = 1"
            >已完成</el-button
          >
          <el-button
            style="float:right;width: 90px;margin-left: 10px;"
            type="primary"
            size="medium"
            @click="ScheduleDialog = true"
            >新建</el-button
          >
        </div>
      </div>
      <el-container>
        <el-main style="padding: 0%;overflow: auto; height: 330px;">
          <div v-for="(item, key) in ScheduleDate" :key="key">
            <el-descriptions
              :column="3"
              size="medium"
              border
              style="width: 620px;float: left; padding-bottom: 5px;"
              :label-style="LS"
              :contentStyle="CS"
            >
              <el-descriptions-item label="计划" size="small">{{
                item.plan
              }}</el-descriptions-item>
              <el-descriptions-item label="完成时间">{{
                item.finishTime
              }}</el-descriptions-item>
            </el-descriptions>
            <el-button
              style="float: right; margin-top: 5px"
              @click="finishBtn(key)"
              type="success"
              size="small"
              v-show="ScheduleStatus === 0"
              >完成</el-button
            >
            <el-button
              style="float: right; margin-right: 10px; margin-top: 5px;"
              @click="modifyPlan(key)"
              type="primary"
              size="small"
              v-show="ScheduleStatus === 0"
              >修改</el-button
            >
            <el-button
              style="float: right; margin-right: 10px; width: 110px;"
              @click="finishBtn(key)"
              type="danger"
              v-show="ScheduleStatus === 1"
              >删除</el-button
            >
          </div></el-main
        >
      </el-container>
    </el-card>
    <el-dialog title="新建计划安排" :visible.sync="ScheduleDialog" width="30%">
      <el-input
        v-model="ScheduleForm.plan"
        placeholder="请输入计划安排"
      ></el-input>
      <div style="margin-top: 15px;">
        <el-date-picker
          v-model="ScheduleForm.finishTimeDate"
          type="date"
          placeholder="选择完成日期"
          style="width: 210px;"
          :picker-options="expireTimeOption"
        >
        </el-date-picker>
        <el-time-picker
          v-model="ScheduleForm.finishTimeDay"
          placeholder="选择完成时间点"
          style="width: 210px;"
        >
        </el-time-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="scheduleBtnCancel">取 消</el-button>
        <el-button type="primary" @click="scheduleBtnConfim">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改计划安排" :visible.sync="modifyDialog" width="30%">
      <el-input v-model="modifydata.plan" placeholder="输入计划安排"></el-input>
      <div style="margin-top: 15px;">
        <el-date-picker
          v-model="modifydata.finishTimeDate"
          type="date"
          placeholder="选择完成日期"
          style="width: 210px;"
          :picker-options="expireTimeOption"
        >
        </el-date-picker>
        <el-time-picker
          v-model="modifydata.finishTimeDay"
          placeholder="选择完成时间点"
          style="width: 210px;"
        >
        </el-time-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="modifyPlanFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer
      title="通知列表"
      :visible.sync="noticeDrawer"
      direction="rtl"
      size="45%"
    >
      <el-container>
        <el-main>
          <div v-for="(item, key) in noticeList" :key="key">
            <el-descriptions
              size="medium"
              border
              style="width: 480px;float: left; padding-bottom: 5px;"
              :label-style="LS"
              :contentStyle="CS"
            >
              <el-descriptions-item label="通知" size="small">{{
                item.message
              }}</el-descriptions-item>
              <el-descriptions-item label="时间" size="small">{{
                item.sendTime
              }}</el-descriptions-item>
            </el-descriptions>
            <el-button
              style="float: right; margin-right: 10px;"
              @click="readerNotice(key)"
              type="success"
              v-show="item.reader === 0"
              >已读</el-button
            >
          </div>
        </el-main>
      </el-container>
    </el-drawer>
  </div>
</template>
<script>
import { removeToken } from "../utils/token.js";
import { loginOutApi, getUserNameApi } from "../api/UserApi.js";
import {
  selectMessageListApi,
  sendMessageApi,
  readerMessageApi,
  countUnReaderApi
} from "../api/NoticeApi.js";
import {
  insertScheduleApi,
  getScheduleListApi,
  finishScheduleApi,
  deleteScheduleApi,
  getRecentPlanApi,
  modifyPlanApi
} from "../api/ScheduleApi.js";
export default {
  data() {
    return {
      pageTitle: "云笔记系统",
      userName: null,
      modifydata: {
        id:"",
        plan:"",
        status:"",
        finishTimeDate:"",
        finishTimeDay:""
      },
      modifyDialog: false, //修改计划对话框
      isSharePage: false, //此页面是否为共享页面
      openSchedule: false, //计划表
      ScheduleStatus: 0, //行程计划 已完成 和 未完成  状态
      ScheduleDialog: false, //新建计划弹窗
      noticeUnReader: false, //是否有未读消息
      noticeDrawer: false, //通知列表=抽屉
      noticeList: [], //通知列表
      ScheduleForm: {
        plan: "", //计划
        finishTimeDate: "", //几月几号
        finishTimeDay: "" //一天的某一个时间
      },
      recentPlan: {}, //最近计划
      ScheduleDate: [],
      CS: {
        "text-align": "center", //文本居中
        "min-width": "210px", //最小宽度
        "word-break": "break-all" //过长时自动换行
      },
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "30px",
        "min-width": "70px",
        "word-break": "keep-all"
      },
      expireTimeOption: {
        disabledDate(date) {
          // return date.getTime() < Date.now() - 24 * 60 * 60 * 1000// 当天可选：
          return date.getTime() < Date.now();
        }
      }
    };
  },
  watch: {
    ScheduleStatus(curValue, oldValue) {
      this.getScheduleList();
    }
  },
  methods: {
    getRecentPlan() {
      let params = {
        status: 0
      };
      getRecentPlanApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            if (data.length !== 0) {
              this.recentPlan = data;
            }
          }
        })
        .catch(err => {});
    },
    modifyPlanFun() {
      let params = {
        id: this.modifydata.id,
        plan: this.modifydata.plan,
        finishTimeDate: this.modifydata.finishTimeDate,
        finishTimeDay: this.modifydata.finishTimeDay
      };
      modifyPlanApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              type: "success",
              message: message
            });
            this.getScheduleList();
            this.getRecentPlan();
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.modifyDialog = false;
    },
    modifyPlan(key) {
      this.modifydata.id = this.ScheduleDate[key].id;
      this.modifydata.plan = this.ScheduleDate[key].plan;
      this.modifydata.status = this.ScheduleDate[key].status;
      this.modifydata.finishTimeDate = new Date(this.ScheduleDate[key].finishTime);
      this.modifydata.finishTimeDay = new Date(this.ScheduleDate[key].finishTime);
      this.modifyDialog = true;
    },
    getNoticeList() {
      selectMessageListApi({})
        .then(res => {
          let { type, data } = res.data;
          this.noticeList = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getNoticeUnReaderCount() {
      countUnReaderApi({})
        .then(res => {
          let { type, data } = res.data;
          if (type === "S") {
            if (data > 0) {
              this.noticeUnReader = true;
            } else {
              this.noticeUnReader = false;
            }
          }
        })
        .catch(err => {});
    },
    getUserName() {
      getUserNameApi()
        .then(res => {
          let { data } = res.data;
          this.userName = data;
          if (this.userName !== null) {
            this.getRecentPlan();
            this.getNoticeUnReaderCount();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    scheduleBtnCancel() {
      this.ScheduleDialog = false;
      this.ScheduleForm = {};
    },
    getScheduleList() {
      let params = {
        status: this.ScheduleStatus
      };
      getScheduleListApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            this.ScheduleDate = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    openScheduleCard() {
      this.openSchedule = true;
      this.getScheduleList();
    },
    finishBtn(index) {
      let str;
      if (this.ScheduleStatus === 0) {
        str = "完成";
      } else {
        str = "删除";
      }
      this.$confirm("此操作将永久" + str + "该计划安排, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.ScheduleStatus === 0) {
            this.finishSchedule(index);
          } else {
            this.deleteSchedule(index);
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消"
          });
        });
    },
    finishSchedule(index) {
      let params = {
        id: this.ScheduleDate[index].id
      };
      finishScheduleApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.getScheduleList();
            this.getRecentPlan();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteSchedule(index) {
      let params = {
        id: this.ScheduleDate[index].id
      };
      deleteScheduleApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.getScheduleList();
            this.getRecentPlan();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    scheduleBtnConfim() {
      insertScheduleApi(this.ScheduleForm)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.ScheduleDialog = false;
            this.ScheduleForm = {};
            this.getScheduleList();
            this.getRecentPlan();
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginOut() {
      loginOutApi()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      window.location.reload();
    },
    handleCommand(command) {
      if (command === "loginOut") {
        this.loginOut();
        removeToken("token");
      } else if (command === "notice") {
        this.noticeDrawer = true;
        this.getNoticeList();
      }
    },
    readerNotice(index) {
      let params = {
        id: this.noticeList[index].id
      };
      readerMessageApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.getNoticeList();
            this.getNoticeUnReaderCount();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    login() {
      this.$router.push("/login");
    },
    toShare() {
      this.$router.push("/");
    }
  },
  created() {
    if (this.$router.history.current.name === "share") {
      this.isSharePage = true;
    }
    this.getUserName();
  }
};
</script>
<style scoped>
.scheduleBtn {
  float: right;
  margin-right: 30px;
  margin-top: 7px;
}
.scheduleStyle {
  float: right;
  margin-right: 30px;
  margin-top: 5px;
  height: 30px;
  font-size: medium;
}
.box-card {
  position: absolute;
  z-index: 2000;
  margin-left: 400px;
  margin-top: 60px;
  width: 800px;
  height: 500px;
}
.el-card__body {
  padding: 0%;
}
.el-icon-close {
  font-size: 30px;
  color: black;
}
.unfinishBtnStyle {
  float: left;
  width: 318px;
  text-align: center;
  border-right: #bcbcbc 1px solid;
}
.finishBtnStyle {
  float: left;
  width: 318px;
  text-align: center;
  border-right: #bcbcbc 1px solid;
}
.curScheduleStyleBtn {
  background-color: #e2f7ff;
  color: #3fc9ff;
}
.boxCardBtn {
  display: inline-block;
  margin-top: 20px;
}
.info {
  float: right;
  margin-right: 50px;
  margin-top: 6px;
}
</style>
