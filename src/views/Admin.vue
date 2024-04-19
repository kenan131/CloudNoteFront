<template>
  <div>
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside class="notebooklist" style="width: 260px; float: left;">
          <button class="buStyle" @click="toHome">主页</button>
          <el-menu
            class="notebookInfo"
            @select="selectBookMenu"
            v-if="bookList.length !== 0"
          >
            <el-menu-item
              style="border-bottom: solid 0.5px #d8d8d8;border-top: solid 0.5px #d8d8d8;"
              v-for="(item, key) in bookList"
              :key="key"
              :index="key.toString()"
              v-bind:class="{
                chosenNotebook: curBookIndex === key.toString()
              }"
            >
              <span style="padding-left: 20px;">{{ item.bookName }}</span>
            </el-menu-item>
          </el-menu>
          <div
            v-else
            style="margin-top:260px;padding-left:30px;color:rgb(61, 191, 0)"
          >
            没有笔记数据！
          </div>
        </el-aside>
        <el-main
          style="padding: 0;float: right;"
          v-loading="editorLoading"
          v-show="curBookIndex.length !== 0"
        >
          <div class="bookHeadStyle">
            <div style="display: flex; left: 300px; position: absolute;">
              <span style="width: 83px; margin-top: 10px">笔记名：</span>
              <span style="width: auto; margin-top: 10px">{{
                curBookName
              }}</span>
            </div>
            <div style="display: flex; left: 600px; position: absolute">
              <el-button size="small" @click="acceptBook" type="success"
                >通过</el-button
              >
            </div>
            <div style="display: flex; left: 700px; position: absolute">
              <el-button
                size="small"
                @click="unAcceptVisible = true"
                type="danger"
                >不通过</el-button
              >
            </div>
          </div>
          <div>
            <LookMarkdown v-show="curBookIndex.length !== 0"></LookMarkdown>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="信息输入框"
      :visible.sync="unAcceptVisible"
      width="30%"
      :before-close="cleanMessage"
    >
      <el-input
        placeholder="请输入不通过理由！"
        v-model="unAcceptMessage"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cleanMessage">取 消</el-button>
        <el-button type="primary" @click="unAcceptBook"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import {
  getShareBookListApi,
  getBookTextApi,
  examineBookShareStatusApi,
  checkIsAdminApi
} from "../api/BookApi.js";
import LookMarkdown from "../components/Editor/LookMarkdown.vue";
export default {
  components: { Header, LookMarkdown },
  name: "admin",
  comments: {
    Header
  },
  data() {
    return {
      bookList: [],
      curBookIndex: "",
      editorLoading: false,
      curBookName: "",
      unAcceptVisible: false,
      unAcceptMessage: ""
    };
  },
  methods: {
    selectBookMenu(curValue, oldValue) {
      this.curBookIndex = curValue;
      this.$store.commit(
        "setLooklookBookCurId",
        this.bookList[curValue].bookId
      );
      this.curBookName = this.bookList[curValue].bookName;
      this.getText();
    },
    cleanMessage() {
      this.unAcceptMessage = "";
      this.unAcceptVisible=false;
    },
    getBookList() {
      let params = {};
      getShareBookListApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            if (data === null) {
              this.bookList = [];
            } else {
              this.bookList = data;
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getText() {
      this.editorLoading = true;
      console.log("object");
      let params = {
        bookId: this.bookList[this.curBookIndex].bookId
      };
      getBookTextApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            this.text = data;
            this.editorLoading = false;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    unAcceptBook() {
      let params = {
        bookId: this.bookList[this.curBookIndex].bookId,
        shareStatus: 0,
        message: "笔记("+this.bookList[this.curBookIndex].bookName+")共享审核不同了！("+this.unAcceptMessage+")"
      };
      examineBookShareStatusApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.getBookList();
            this.curBookIndex = "";
            this.unAcceptVisible=false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    acceptBook() {
      let params = {
        bookId: this.bookList[this.curBookIndex].bookId,
        shareStatus: 2,
        message:"笔记("+this.bookList[this.curBookIndex].bookName+")已经通过审核了！"
      };
      examineBookShareStatusApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.getBookList();
            this.cleanMessage();
            this.curBookIndex="";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toHome() {
      this.$router.push("home");
    }
  },
  created() {
    checkIsAdminApi({})
      .then(res => {
        let { type, message } = res.data;
        if (type === "E") {
          this.$router.push("/home");
        }
      })
      .catch(err => {});
    this.getBookList();
  }
};
</script>

<style >
.header {
  background-color: rgb(248, 248, 248);
  color: rgb(24, 21, 17);
  font-size: 25px;
  display: table-cell;
  vertical-align: bottom;
  border-bottom: 1px solid #cccccc;
}
.notebookInfo {
  background-color: rgb(0, 0, 0, 0);
  padding: 10px;
  font-size: 18px;
  border: none;
  padding: 0%;
}
.notebooklist {
  background-color: rgb(248, 248, 248);
  height: 740px;
}
.bookHeadStyle {
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: solid;
  border-color: #ccc;
  border-width: thin;
}
.buStyle {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 50px;
  width: 140px;
  height: 40px;
  background-color: rgb(198, 249, 255);
  border: none;
  border-radius: 5px;
}
.buStyle:hover {
  cursor: pointer;
  background-color: rgb(187, 239, 255);
}
* {
  margin: 0;
  padding: 0;
}
.el-aside {
  border-right: 1px solid #ccc;
  height: calc(100vh - 60px);
}
</style>
