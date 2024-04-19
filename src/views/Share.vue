<template>
  <div>
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside class="notebookSharelist" style="width: 240px; float: left;">
          <button class="buStyle" @click="toHome">主页</button>
          <el-menu
            class="notebookInfo"
            @select="selectBookMenu"
            v-if="bookList.length !== 0"
          >
            <el-menu-item
              style="border-bottom: solid 0.5px #d8d8d8;
              border-top: solid 0.5px #d8d8d8;"
              v-for="(item, key) in bookList"
              :key="key"
              :index="key.toString()"
              v-contextmenu:contextmenu
              @contextmenu.prevent="rightClick"
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
          <LookMarkdown v-show="curBookIndex.length !== 0"></LookMarkdown>
        </el-main>
      </el-container>
    </el-container>
    <v-contextmenu
      theme="dark"
      class="rightMenu"
      ref="contextmenu"
      @contextmenu="handleNoteRightMenu"
    >
      <v-contextmenu-item @click="Visible = true" v-show="loginStatus"
        >收录笔记</v-contextmenu-item
      >
    </v-contextmenu>
    <el-dialog title="收录笔记" :visible.sync="Visible" width="30%">
      <span>请选择收录后的笔记本</span>
      <el-select v-model="saveNoteBookId" placeholder="请选择">
        <el-option
          style="padding-left: 20px;"
          v-for="item in noteList"
          :key="item.id"
          :label="item.notebookName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button class="buStyle" @click="Visible = false">取 消</el-button>
        <el-button class="buStyle" @click="saveBook">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import { getShareSuccessListApi } from "../api/ShareApi.js";
import LookMarkdown from "../components/Editor/LookMarkdown.vue";
import { getUserNameApi } from "../api/UserApi.js";
import { noteBookListApi } from "../api/NoteBookApi.js";
import { saveBookToNoteBookApi } from "../api/BookApi.js";
export default {
  components: { Header, LookMarkdown },
  name: "share",
  comments: {
    Header
  },
  data() {
    return {
      bookList: [],
      curBookIndex: "",
      curBookName: "",
      editorLoading: false,
      rightBookId: "",
      loginStatus: false,
      Visible: false,
      saveNoteBookId: "",
      noteList: []
    };
  },
  methods: {
    handleNoteRightMenu(vnode) {
      this.rightBookId = vnode.data.key;
    },
    saveBook() {
      let params = {
        bookId:this.bookList[this.rightBookId].bookId,
        noteBookId:this.saveNoteBookId
      }
      saveBookToNoteBookApi(params)
      .then(res=>{
        let { type, message} = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.saveNoteBookId="";
          }
      })
      .catch(err=>{
        console.log(err);
      })
      this.Visible = false;
    },
    selectBookMenu(curValue, oldValue) {
      this.curBookIndex = curValue;
      this.$store.commit(
        "setLooklookBookCurId",
        this.bookList[curValue].bookId
      );
      this.curBookName = this.bookList[curValue].bookName;
    },
    getNoteBookList() {
      noteBookListApi({})
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            this.noteList = data;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getShareBookList() {
      let params = {};
      getShareSuccessListApi(params)
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
    getUserName() {
      getUserNameApi()
        .then(res => {
          let { data } = res.data;
          this.userName = data;
          if (this.userName !== null) {
            this.loginStatus = true;
            this.getNoteBookList();
          } else {
            this.loginStatus = false;
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
    this.getShareBookList();
    this.getUserName();
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
.notebookInfo {
  background-color: rgb(0, 0, 0, 0);
  padding: 10px;
  font-size: 18px;
  border: none;
  padding: 0%;
}
.notebookSharelist {
  background-color: rgb(248, 248, 248);
  height: 640px;
}
.bookHeadStyle {
  height: 50px;
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
  background-color: rgb(223, 223, 223);
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
.rightMenu {
  width: 100px;
  text-align: center;
}
</style>
