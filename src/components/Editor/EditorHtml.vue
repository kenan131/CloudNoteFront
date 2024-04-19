<template>
  <div>
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @onChange="onChange"
      v-loading="editorLoading"
    />
  </div>
</template>
<script>
import Vue from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import {getBookTextApi,saveBookApi} from "../../api/BookApi"
export default Vue.extend({
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default",
      curBookIndex:"",
      editorLoading:false
    };
  },
  watch: {
    "$store.state.curBookIndex"(curValue,oldValue) {
      this.curBookIndex=curValue;
      this.getBookText();
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    getBookText() {
      this.editorLoading = true;
      let params = {
        bookId: this.$store.state.bookList[this.curBookIndex].bookId
      };
      getBookTextApi(params)
        .then(res => {
          let { type, message, data } = res.data;
          if (type === "S") {
            this.html = data;
            this.editorLoading = false;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    onChange(a) {
      this.$store.commit("setBookData", this.html);
    }
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  }
});
</script>
<style></style>
