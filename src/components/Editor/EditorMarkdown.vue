<template>
  <div>
    <v-md-editor
      class="editorStyle"
      v-model="text"
      height="640px"
      @change="change"
      @save="save"
      @upload-image="uploadImage"
      :disabled-menus="[]"
      v-loading="editorLoading"
    ></v-md-editor>
  </div>
</template>
<script>
import Vue from "vue";
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import hljs from "highlight.js";
import { getBookTextApi, saveBookApi } from "../../api/BookApi";
VMdEditor.use(githubTheme, {
  Hljs: hljs
});
Vue.use(VMdEditor);
// import COS from 'cos-js-sdk-v5';
export default {
  data() {
    return {
      text: "",
      editorLoading: false,
      curBookIndex: "",
      init: true,
      oss: ""
    };
  },
  watch: {
    "$store.state.curBookIndex"(curValue, oldValue) {
      if (curValue.length === 0) {
        return;
      }
      this.curBookIndex = curValue;
      this.init = true;
      this.getBookText();
    }
  },
  methods: {
    getBookText() {
      this.editorLoading = true;
      let params = {
        bookId: this.$store.state.bookList[this.curBookIndex].bookId
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
    change(text, hot) {
      if (this.init === false) {
        this.$store.commit("setBookData", text);
      } else {
        this.init = false;
      }
    },
    save() {
      let params = {
        bookId: this.$store.state.bookList[this.curBookIndex].bookId,
        text: this.text
      };
      saveBookApi(params)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
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
    uploadImage(event, insertImage, files) {

    }
  },
  created() {

  }
};
</script>
<style scoped>
.editorStyle {
  box-shadow: 0px -10px 0px 0px #ffffff;
  border-bottom: solid 0.5px #d8d8d8;
}
</style>
