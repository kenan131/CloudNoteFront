<template>
  <div style="height: 100vh;">
    <el-container style="height: 100%">
      <el-header class="header">
        <div style="margin-left: 30px; margin-top: 20px; float: left;">
          <span>📕</span>
          <strong> {{ pageTitle }}</strong>
        </div>
        <div style="float: right;">
          <el-button
            size="medium"
            style="margin-top: 12px;
            margin-right: 30px;"
            type="primary"
            @click="toHome"
            >主页</el-button
          >
        </div>
      </el-header>
      <el-main class="mainStyle">
        <el-card style="margin: 0 auto; width: 1300px; height: 100%;">
          <div class="bookNameStyle">{{ bookName }}</div>
          <v-md-preview :text="text" class="lookStyle"></v-md-preview>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Vue from "vue";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

import hljs from "highlight.js";

VMdPreview.use(githubTheme, {
  Hljs: hljs
});
Vue.use(VMdPreview);

import Header from "../components/Header.vue";
import { getShareBookApi } from "../api/ShareApi.js";
export default {
  name: "",
  components: {
    Header
  },
  data() {
    return {
      pageTitle: "云笔记系统",
      text: '',
      bookName: "笔记名"
    };
  },
  methods: {
    getShareBook(uuid) {
      let params = {
        uuid: uuid
      };
      getShareBookApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            this.text = data.text;
            this.bookName = data.name;
          } else {
            this.text = "暂无分享笔记数据!";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toHome() {
      this.$router.push("/home");
    }
  },
  created() {
    let uuid = window.location.search;
    if (uuid.length === 0) {
      this.$message({
        showClose: true,
        message: "未找到分享的笔记数据！"
      });
    }
    uuid = uuid.substring(6, window.location.search.length);
    this.getShareBook(uuid);
  }
};
</script>
<style scoped>
.header {
  background-color: rgb(248, 248, 248);
  color: rgb(24, 21, 17);
  font-size: 25px;
  display: table-cell;
  vertical-align: bottom;
  border-bottom: 1px solid #cccccc;
}
.lookStyle {
  /* box-shadow: 0px -10px 0px 0px #ffffff; */
  /* border-bottom: solid 0.5px #d8d8d8; */
  overflow: auto;
  margin-left: 100px;
  margin-right: 100px;
  height: 750px;
  padding: 0%;
  /* background-color: aliceblue; */
}
.mainStyle {
  width: 100%;
  height: 100%;
  /* background-color: #eaeaea; */
  /* padding: 0%; */
  padding: 0%;
}
.bookNameStyle {
  margin: 0 auto;
  width: 280px;
  background-color: none;
  margin-bottom: 15px;
}
</style>
