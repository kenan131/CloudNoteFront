<template>
  <div>
    <el-container style="height: 100%;">
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <!-- 笔记本列表 -->
        <el-aside width="200px" class="notebooklist">
          <NoteBookList></NoteBookList>
        </el-aside>
        <el-main style="padding:0%">
          <BookList></BookList>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import NoteBookList from "../components/NoteBookList.vue";
import BookList from "../components/BookList.vue";
import EditorMain from "../components/EditorMain.vue";
export default {
  name: "Home",
  components: {
    Header,
    NoteBookList,
    BookList,
    EditorMain
  },
  data() {
    return {
      bookText: "",
      editMode: true,
      noteRightMenuValues: {},
      curNotebook: {
        notebookName: "数学",
        bookName: ""
      }
    };
  },
  methods: {
    handleLogout() {}
  }
};
</script>
<style scoped>
.notebooklist {
  background-color: rgb(248, 248, 248);
  width: 100%;
  height: 100%;
}

.booklist {
  background-color: rgb(255, 255, 255);
  width: 100%;
  height: 100%;
}
.header {
  background-color: rgb(248, 248, 248);
  color: rgb(24, 21, 17);
  font-size: 25px;
  display: table-cell;
  vertical-align: bottom;
  border-bottom: 1px solid #cccccc;
}
.el-aside {
  border-right: 1px solid #ccc;
  height: calc(100vh - 60px);
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
