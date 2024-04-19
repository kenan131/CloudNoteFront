<template>
  <div>
    <v-md-preview :text="text" class="lookStyle"></v-md-preview>
  </div>
</template>
<script>
import Vue from "vue";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import { getBookTextApi } from "../../api/ShareApi";

import hljs from "highlight.js";

VMdPreview.use(githubTheme, {
  Hljs: hljs
});
Vue.use(VMdPreview);

export default {
  data() {
    return {
      text: "",
      editorLoading: false
    };
  },
  watch: {
    "$store.state.lookBookCurId"(curValue, oldValue) {
      this.curBookId = curValue;
      this.getBookText();
    }
  },
  methods: {
    getBookText() {
      this.editorLoading = true;
      let params = {
        bookId: this.curBookId
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
    }
  }
};
</script>
<style>
.lookStyle {
  box-shadow: 0px -10px 0px 0px #ffffff;
  border-bottom: solid 0.5px #d8d8d8;
  overflow:auto;
  margin-left: 100px;
  margin-right: 100px;
  height:700px;
}
</style>
