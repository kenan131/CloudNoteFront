<template>
  <div>
    <el-container>
      <el-aside class="bookAside" style="width:190px">
        <div style="margin: 5px">
          <el-input
            clearable
            v-model="keyWord"
            @blur="getBookList"
            @keyup.enter.native="getBookList"
            placeholder="搜索笔记"
          ></el-input>
        </div>
        <el-button class="newButton" @click="newBookButton">新建笔记</el-button>
        <el-menu
          class="bookInfo"
          @select="selectBookMenu"
          v-if="bookList.length !== 0"
        >
          <el-menu-item
            v-for="(item, key) in bookList"
            :key="key"
            :index="key.toString()"
            v-contextmenu:contextmenu
            @contextmenu.prevent="rightClick"
            v-bind:class="{
              chosenNotebook: curBookIndex === key.toString()
            }"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.createTime"
              placement="top"
            >
              <span>
                {{ item.bookName }}
              </span>
            </el-tooltip>
          </el-menu-item>
        </el-menu>
        <div v-else style="margin-top: 260px; padding-left: 30px; color: aqua">
          没有笔记数据！
        </div>
      </el-aside>
      <el-main style="padding: 0%" v-show="curBookIndex.length != 0">
        <div class="bookHeadStyle">
          <div style="display: flex; left: 30px; position: absolute">
            <span style="width: 83px; margin-top: 10px">笔记名：</span>
            <el-input
              v-model="curBookName"
              @keyup.enter.native="reBookNameEnter"
              @blur="reBookName"
              ref="reNameInput"
            ></el-input>
          </div>
          <div
            v-loading="loading"
            style="display: flex; left: 340px; position: absolute; font-size: 10px"
          >
            <div v-if="saving">已保存</div>
            <div v-else>未保存</div>
          </div>
          <div style="display: flex; left: 400px; position: absolute">
            <el-button size="small" @click="savingBookText">保存</el-button>
          </div>
        </div>
        <div v-show="curBookIndex">
          <EditorMarkdown></EditorMarkdown>
        </div>
      </el-main>
    </el-container>

    <v-contextmenu
      theme="dark"
      class="rightMenu"
      ref="contextmenu"
      @contextmenu="handleNoteRightMenu"
    >
      <v-contextmenu-item @click="dialogVisible = true" v-show="!rubbishTyep"
        >新建</v-contextmenu-item
      >
      <v-contextmenu-item @click="open" v-show="!rubbishTyep"
        >删除</v-contextmenu-item
      >
      <v-contextmenu-item
        @click="shiftDialogVisible = true"
        v-show="!rubbishTyep"
        >移动</v-contextmenu-item
      >
      <v-contextmenu-item @click="downLoadBook" v-show="!rubbishTyep"
        >下载</v-contextmenu-item
      >
      <v-contextmenu-item @click="setBookShare" v-show="!rubbishTyep"
        >共享</v-contextmenu-item
      >
      <v-contextmenu-item @click="shareFriend" v-show="!rubbishTyep"
        >分享</v-contextmenu-item
      >
      <v-contextmenu-item @click="restoreBook" v-show="rubbishTyep"
        >还原</v-contextmenu-item
      >
      <v-contextmenu-item @click="realDelBook" v-show="rubbishTyep"
        >永久删除</v-contextmenu-item
      >
      <v-contextmenu-item @click="drawingVisible=true" v-show="!rubbishTyep"
        >画板</v-contextmenu-item
      >
    </v-contextmenu>

    <el-dialog title="新建笔记" :visible.sync="dialogVisible" width="30%">
      <div style="height: 50px">
        <div
          style="float: left; width: 100px; text-align: center; padding-top: 10px"
        >
          笔记名字:
        </div>
        <el-input
          style="float: right; width: 320px"
          v-model="newBookName"
          @keyup.enter.native="newNoteBook"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newNoteBookCancel">取 消</el-button>
        <el-button type="primary" @click="newNoteBook">新 建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="移动笔记" :visible.sync="shiftDialogVisible" width="30%">
      <span>请选择移动后的笔记本</span>
      <el-select v-model="shiftNoteBookId" placeholder="请选择">
        <el-option
          v-for="item in noteBookList"
          :key="item.id"
          :label="item.notebookName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shiftDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleShift">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分享链接" :visible.sync="shareDialogVisible" width="30%">
      <el-input v-model="shareUrl"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shareDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shareDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="画板" :visible.sync="drawingVisible" width="30%" @close="boardClose">
      <el-input v-model="boardName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="drawingVisible = false">取 消</el-button>
        <el-button type="primary" @click="toDrawing"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EditorMarkdown from "./Editor/EditorMarkdown.vue";
import EditorHtml from "./Editor/EditorHtml.vue";
import {
  getBookListApi,
  insertBookApi,
  deleteBookApi,
  setShareBookApi,
  shiftBookOnNoteBookApi,
  restoreBookApi,
  saveBookApi,
  updateBookNameApi,
  downLoadBookFileApi,
  shareFriendApi,
  realDelBookApi
} from "../api/BookApi";
export default {
  components: {
    EditorMarkdown,
    EditorHtml
  },
  data() {
    return {
      bookList: [],
      noteBookList: [],
      curBookIndex: "",
      curBookName: "",
      cueNoteId: "",
      //自动保存加载
      loading: false,
      //是否保存
      saving: true,
      //右键的笔记id
      noteRightMenuId: "",
      keyWord: "",
      dialogVisible: false,
      newBookName: "",
      rubbishTyep: false,
      shareDialogVisible: false,
      shareUrl: "",
      text: "",
      shiftDialogVisible: false,
      shiftNoteBookId: "",
      drawingVisible:false,//画板对话框显示字段
      boardName:"",//画板名称
    };
  },
  watch: {
    "$store.state.curNoteBookIndex"(curValue, oldValue) {
      if (this.curBookIndex != "" && this.saving === false) {
        this.savingBookLeft();
      }
      // this.$store.commit("setBookList", []);
      // this.bookList = [];
      this.cueNoteId = curValue;
      this.getBookList();
      if (this.$store.state.noteBookList[curValue].id === "999") {
        this.rubbishTyep = true;
      } else {
        this.rubbishTyep = false;
      }
      this.noteBookList = this.$store.state.noteBookList;
      this.curBookIndex = "";
    },
    "$store.state.bookData"(curValue, oldValue) {
      if (this.$store.state.bookSaveStatus === true) {
        this.saving = false;
        this.$store.commit("setBookSaveStatus", false);
        setTimeout(() => {
          if (this.$store.state.bookSaveStatus === false) {
            this.savingBookText();
          }
        }, 15000);
      } else {
        this.saving = false;
      }
    },
    "$store.state.bookSaveStatus"(curValue,oldValue){
      this.saving=curValue;
    }
  },
  methods: {
    open() {
      this.$confirm("此操作将永久删除该笔记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleDelNote();
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleShift() {
      let params = {
        noteBookId: this.shiftNoteBookId,
        bookId: this.bookList[this.curBookIndex].bookId
      };
      shiftBookOnNoteBookApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "笔记移动成功！",
              type: "success"
            });
            this.shiftDialogVisible = false;
            this.shiftNoteBookId = "";
            this.getBookList();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    setBookShareStatus(status) {
      let params = {
        bookId: this.bookList[this.noteRightMenuId].bookId,
        shareStatus: status
      };
      setShareBookApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "共享笔记设置成功！",
              type: "success"
            });
            this.getBookList();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    setBookShare() {
      if (this.bookList[this.noteRightMenuId].share !== 0) {
        this.$confirm("是否取消共享状态！", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.setBookShareStatus(0);
          })
          .catch(() => {
            return;
          });
      } else {
        this.setBookShareStatus(1);
      }
    },
    shareFriend() {
      let params = {
        bookId: this.bookList[this.noteRightMenuId].bookId
      };
      shareFriendApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "生成分享链接成功！",
              type: "success"
            });
            this.shareDialogVisible = true;
            this.shareUrl = window.location.host + "/shareBook?uuid=" + data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectBookMenu(index) {
      if (this.curBookIndex != "" && this.saving === false) {
        this.savingBookLeft();
      }
      this.curBookIndex = index;
      this.$store.commit("setcurBookIndex", index);
      this.curBookName = this.bookList[index].bookName;
    },
    savingBookText() {
      this.loading = true;
      let params = {
        bookId: this.$store.state.bookList[this.curBookIndex].bookId,
        text: this.$store.state.bookData
      };
      saveBookApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.loading = false;
            this.$store.commit("setBookSaveStatus", true);
            this.saving = true;
            this.$message({
              showClose: true,
              message: "保存笔记成功！",
              type: "success"
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    savingBookLeft() {
      let params = {
        bookId: this.$store.state.bookList[this.curBookIndex].bookId,
        text: this.$store.state.bookData
      };
      saveBookApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.saving = true;
            this.$store.commit("setBookSaveStatus", true);
            this.$message({
              showClose: true,
              message: "保存笔记成功！",
              type: "success"
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleNoteRightMenu(vnode) {
      this.noteRightMenuId = vnode.data.key;
    },
    reBookName() {
      let params = {
        bookId: this.bookList[this.curBookIndex].bookId,
        bookName: this.curBookName
      };
      updateBookNameApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "更改笔记名成功！",
              type: "success"
            });
            this.getBookList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    downLoadBook() {
      let params = {
        bookId: this.bookList[this.noteRightMenuId].bookId
      };
      downLoadBookFileApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            const blob = new Blob([data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = message + ".md";
            a.click();
            window.URL.revokeObjectURL(url);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleDelNote() {
      let params = {
        bookId: this.bookList[this.noteRightMenuId].bookId
      };
      deleteBookApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "删除笔记成功！",
              type: "success"
            });
            this.getBookList();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    reBookNameEnter() {
      this.$refs.reNameInput.blur();
    },
    getBookList() {
      let params = {
        noteBookId: this.$store.state.noteBookList[this.cueNoteId].id,
        bookName: this.keyWord
      };
      getBookListApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            this.bookList = data;
            this.$store.commit("setBookList", data);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    newNoteBook() {
      let params = {
        noteBookId: this.$store.state.noteBookList[this.cueNoteId].id,
        bookName: this.newBookName
      };
      insertBookApi(params).then(res => {
        let { type, message } = res.data;
        if (type === "S") {
          this.$message({
            showClose: true,
            message: "新建笔记成功！",
            type: "success"
          });
          this.dialogVisible = false;
          this.getBookList();
        }
      });
    },
    newNoteBookCancel() {
      this.dialogVisible = false;
    },
    //还原笔记
    restoreBook() {
      let params = {
        bookId: this.bookList[this.noteRightMenuId].bookId
      };
      restoreBookApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "还原笔记成功！",
              type: "success"
            });
            this.getBookList();
            this.curBookIndex="";
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    //永久删除笔记
    realDelBook(){
      let params = {
        bookId: this.bookList[this.noteRightMenuId].bookId
      };
      realDelBookApi(params)
      .then(res=>{
        let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.getBookList();
          }
      })
      .catch(err=>{
        console.log(err);
      });
    },
    newBookButton() {
      if (this.cueNoteId === "") {
        this.$message({
          showClose: true,
          message: "请先选择笔记本后再新建笔记！",
          type: "warring"
        });
        return;
      }
      if (this.$store.state.noteBookList[this.cueNoteId].id === "999") {
        this.$message({
          showClose: true,
          message: "回收站不能新建笔记！",
          type: "warring"
        });
        return;
      }
      this.dialogVisible = true;
    },
    //画板界面
    toDrawing(){
      // let url = window.location.host+'/board?boardName'+this.boardName;
      this.$router.push({ path: '/board', query: { boardName: this.boardName } })
    },
    //画板界面关闭，清除数据
    boardClose(){
      this.boardName="";
    },
  }
};
</script>
<style scoped>
.bookInfo {
  background-color: rgb(0, 0, 0, 0);
  padding: 10px;
  font-size: 18px;
  border: none;
  padding: 0%;
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
.newButton {
  width: 170px;
  margin-left: 10px;
  margin-bottom: 10px;
  background-color: #cdecfc;
}
.rightMenu {
  width: 75px;
  text-align: center;
}
.bookAside {
  float: left;
  border: 1px solid #ccc;
}
.el-aside {
  border-right: 1px solid #ccc;
  height: calc(100vh - 60px);
}
</style>
