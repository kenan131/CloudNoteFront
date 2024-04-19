<template>
  <div>
    <div style="margin: 5px">
      <el-input
        clearable
        v-model="keyWord"
        @blur="getNoteBookList"
        @keyup.enter.native="getNoteBookList"
        placeholder="搜索笔记本"
      ></el-input>
    </div>
    <div class="notebookHead">
      <div style="margin-left:30px; float:left; margin-top:2px">笔记本</div>
      <el-button
        class="importButton"
        size="small"
        type="primary"
        @click="importVisible = true"
        >导入 <i class="el-icon-upload el-icon--right"></i></el-button
      >
    </div>
    <el-menu class="notebookInfo" @select="selectNoteMenu" v-loading="loading">
      <el-menu-item
        v-for="(item, key) in notebookList"
        v-contextmenu:contextmenu
        :key="key"
        :index="key.toString()"
        v-bind:class="{
          chosenNotebook: curNoteBookIndex === key.toString()
        }"
      >
        <el-input
          v-if="noteBookNameUpdate == key.toString()"
          v-model="reNameValue"
          @blur="reNameCancel"
          @keyup.enter.native="reNameEnter"
        ></el-input>
        <div v-else>{{ item.notebookName }}</div>
      </el-menu-item>
    </el-menu>
    <!-- 右键菜单 -->
    <v-contextmenu
      theme="dark"
      class="rightMenu"
      ref="contextmenu"
      @contextmenu="handleNoteRightMenu"
    >
      <v-contextmenu-item @click="dialogVisible = true"
        >新建</v-contextmenu-item
      >
      <v-contextmenu-item @click="reName">重命名</v-contextmenu-item>
      <v-contextmenu-item @click="handleDelNote">删除</v-contextmenu-item>
    </v-contextmenu>

    <el-dialog title="新建笔记本" :visible.sync="dialogVisible" width="30%">
      <div style="height: 50px;">
        <div
          style="float: left; width: 100px; text-align: center; padding-top: 10px;"
        >
          笔记本名字:
        </div>
        <el-input
          style="float: right; width: 320px;"
          v-model="newNoteBookName"
          @keyup.enter.native="newNoteBook"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newNoteBookCancel">取 消</el-button>
        <el-button type="primary" @click="newNoteBook">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导入" :visible.sync="importVisible" width="30%">
      <el-select
        v-model="importData.noteBookId"
        placeholder="请选择导入到哪个笔记本"
      >
        <el-option
          v-for="item in notebookList"
          :key="item.id"
          :label="item.notebookName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <input
        type="file"
        accept=".md"
        name="myFile"
        multiple
        @change="getfile"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="importVisible = false">取 消</el-button>
        <el-button type="primary" @click="importCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  noteBookListApi,
  insertNoteBookApi,
  updateNoteBookNameApi,
  deleteBNoteBookApi,
  importBookFromFileApi,
} from "../api/NoteBookApi.js";
export default {
  data() {
    return {
      keyWord: "",
      notebookList: [],
      curNoteBookIndex: "",
      noteRightMenuId: "",
      dialogVisible: false,
      noteBookNameUpdate: "",
      reNameValue: "",
      newNoteBookName: "",
      loading: false,
      importVisible: false,
      importData: {}
    };
  },
  watch: {},
  methods: {
    selectNoteMenu(index) {
      this.curNoteBookIndex = index;
      this.$store.commit("setcurNoteBookIndex", index);
    },
    handleNoteRightMenu(vnode) {
      this.noteRightMenuId = vnode.data.key;
    },
    handleDelNote(index) {
      let data = {
        noteBookId: this.notebookList[this.noteRightMenuId].id
      };
      deleteBNoteBookApi(data)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "删除笔记本成功！",
              type: "success"
            });
            this.getNoteBookList();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    reName() {
      this.noteBookNameUpdate = this.noteRightMenuId;
      this.reNameValue = this.notebookList[this.noteRightMenuId].notebookName;
    },
    reNameCancel() {
      this.noteBookNameUpdate = "";
    },
    reNameEnter() {
      if (this.reNameValue === this.notebookList[this.noteRightMenuId]) {
        this.$message({
          showClose: true,
          message: "和原名称相同，更改取消！",
          type: "warning"
        });
        this.noteBookNameUpdate = "";
        return;
      }
      let data = {
        noteBookId: this.notebookList[this.noteRightMenuId].id,
        name: this.reNameValue
      };
      updateNoteBookNameApi(data)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "更改笔记本名称成功！",
              type: "success"
            });
            this.getNoteBookList();
          }
          this.noteBookNameUpdate = "";
        })
        .catch(err => {
          console.error(err);
        });
    },
    //异步获取文件中的内容
    fileUtil(text) {
      let params ={
        noteBookId:this.importData.noteBookId,
        bookName:this.importData.file[0].name,
        text:text
      }
      importBookFromFileApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: message,
              type: "success"
            });
            this.getNoteBookList();
            this.$store.commit("setcurNoteBookIndex", "");
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    //导入
    importCommit() {
      var file = this.importData.file[0];
      let reader = new FileReader();
      if (typeof FileReader === "undefined") {
        this.$message({
          type: "info",
          message: "您的浏览器不支持FileReader接口"
        });
        return;
      }
      let fun =this;
      reader.onload = function(e) {
        fun.fileUtil(e.target.result);
      };
      reader.readAsText(file);
      this.importVisible = false;
    },
    getfile(event) {
      this.importData.file = event.target.files;
    },
    getNoteBookList() {
      this.loading = true;
      let params = {
        name: this.keyWord
      };
      noteBookListApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            data.push({
              notebookName: "回收站",
              id: "999"
            });
            this.notebookList = data;
            this.$store.commit("setNoteBookList", this.notebookList);
          }
          this.loading = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    newNoteBookCancel() {
      this.dialogVisible = false;
    },
    newNoteBook() {
      if (this.newNoteBookName.length === 0) {
        this.$message({
          showClose: true,
          message: "请输入新建的笔记名称！",
          type: "warning"
        });
        return;
      }
      let data = {
        name: this.newNoteBookName
      };
      insertNoteBookApi(data).then(res => {
        let { type, message } = res.data;
        if (type === "S") {
          this.$message({
            showClose: true,
            message: "新建笔记名称成功！",
            type: "success"
          });
          this.getNoteBookList();
          this.dialogVisible = false;
          this.newNoteBookName = "";
        }
      });
    }
  },
  created() {
    this.getNoteBookList();
  }
};
</script>
<style scoped>
.notebookHead {
  color: rgb(41, 38, 38);
  font-size: 18px;
  margin-top: 1px;
  margin-right: 10px;
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-bottom: 10px;
  color: grey;
}
.notebookInfo {
  background-color: rgb(0, 0, 0, 0);
  padding: 10px;
  font-size: 18px;
  border: none;
  height: 100%;
  overflow: auto;
}
.chosenNotebook {
  background-color: #d5f5fc;
  border-radius: 5%;
}
.importButton {
  margin-left: 10px;
  background-color: rgb(221, 221, 221);
  border: none;
  color: black;
}
</style>
