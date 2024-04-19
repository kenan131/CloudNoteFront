<template>
  <div>
    <div class="bookHeadStyle">
      <div style="display: flex; left: 30px; position: absolute">
        <span style="width: 83px; margin-top: 10px">笔记名：</span>
        <el-input v-model="curBookName"></el-input>
      </div>
      <div
        v-loading="loading"
        style="display: flex; left: 340px; position: absolute; font-size: 10px"
      >
        <div v-if="saving">已保存</div>
        <div v-else>未保存</div>
      </div>
      <div style="display: flex; left: 400px; position: absolute">
        <el-button size="small" @click="open">保存</el-button>
      </div>
    </div>
    <div>
      <EditorMarkdown></EditorMarkdown>
    </div>
  </div>
</template>
<script>
import EditorMarkdown from "./Editor/EditorMarkdown.vue";
import EditorHtml from "./Editor/EditorHtml.vue";
export default {
  components: {
    EditorMarkdown,
    EditorHtml
  },
  data() {
    return {
      curBookName: "",
      loading: false,
      saving: true
    };
  },
  methods: {
    open() {
      this.saving = false;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.saving = true;
        this.$message({
          showClose: true,
          message: "自动保存成功！",
          type: "success"
        });
      }, 2000);
    }
  }
};
</script>
<style>
.bookHeadStyle {
  height: 50px;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: solid;
  border-color: #ccc;
  border-width: thin;
}
</style>
