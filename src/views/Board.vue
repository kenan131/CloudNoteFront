<template>
  <div class="bodyMain">
    <div class="controls mdl-shadow--3dp" style="top: 35px">
      <span
        class="material-symbols-outlined tool"
        id="pencil"
        ref="pencil"
        @click="pencilMode()"
        v-bind:class="{
          select: pencilSelect === true
        }"
        >edit</span
      >
      <div class="mdl-tooltip mdl-tooltip--right" data-mdl-for="pencil">
        铅笔
      </div>
      <span class="material-symbols-outlined tool" id="line" @click="clearBord"
        >clear</span
      >
      <div class="mdl-tooltip mdl-tooltip--right" data-mdl-for="line">
        清除画布
      </div>
      <span class="material-symbols-outlined tool" id="undo" @click="undo"
        >undo</span
      >
      <div class="mdl-tooltip mdl-tooltip--right" data-mdl-for="undo">撤销</div>
      <span class="material-symbols-outlined tool" id="redo" @click="redo"
        >redo</span
      >
      <div class="mdl-tooltip mdl-tooltip--right" data-mdl-for="redo">恢复</div>
      <span class="material-symbols-outlined tool" id="home" @click="toHome"
        >home</span
      >
      <div class="mdl-tooltip mdl-tooltip--right" data-mdl-for="home">主页</div>
    </div>
    <!-- 人数显示 -->
    <span class="users mdl-shadow--3dp mdl-chip mdl-chip--deletable">
      <span class="mdl-chip__text">在线:{{ cntNumber }}人</span>
      <button type="button" class="mdl-chip__action" id="help">
        <i class="material-icons">help</i>
      </button>
    </span>
    <canvas id="board" class="board" ref="myCanvas"></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  name: "",
  data() {
    return {
      canvas: "",
      customizeShow: false, //自定义窗口
      pencilCustomizeShow: false, //铅笔格式选择框
      pencilSelect: false,
      ws: "", //socekct连接对象
      actions: [], //执行操作正向
      unActions: [], //执行操作反向
      cntNumber: 0, //人数
      userCountTimerId: null //定时器
    };
  },
  methods: {
    //创建canvas对象
    createCanvas() {
      let canvas = this.$refs.myCanvas;
      // 创建fabric.Canvas对象
      this.canvas = new fabric.Canvas(canvas, {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#e0e0e0",
        stopContextMenu: true // 屏蔽右键
      });
      let vm = this;
      this.canvas.on("object:added", function(e) {
        if (e.target.type === "path" && e.target.id == null) {
          e.target.id = vm.randomId();
          e.target.selectable = false; // 禁止线条被选中和显示选择框
          vm.actions.push({
            id: e.target.id,
            type: "add",
            path: e.target.path
          });
          vm.sendMessage("add", e.target);
        }
      });
    },
    connectWs() {
      // let url = "ws://43.142.56.116:8088/connect";//正式环境
      let url = "ws://localhost:8088/connect";//开发环境
      let ws = new WebSocket(url);
      this.ws = ws;
      let vm = this;
      ws.onopen = function() {
        // 连接WebSocket成功,显示登录界面(mask默认显示)
        let parms = decodeURIComponent(window.location.search);
        let message = {
          id: 1,
          type: "init",
          totalChunks: 1,
          chunkIndex: 0,
          chunkData: parms
        };
        ws.send(JSON.stringify(message));
      };
      ws.onerror = function() {
        // 出现错误或连接失败,尝试重连
        clearInterval(vm.userCountTimerId);
        setTimeout(initWebSocket, 2500);
      };
      ws.onclose = function() {
        // tip("服务器连接失败,请稍后重试~");
        console.log("连接关闭");
        clearInterval(vm.userCountTimerId);
      };
      var chunksReceived = [];
      var chunksCount = 0;

      ws.onmessage = function(e) {
        let chunk = JSON.parse(e.data);
        chunksReceived[chunk.chunkIndex] = chunk.chunkData;
        chunksCount++;
        if (chunksCount === chunk.totalChunks) {
          // 所有片段都已经接收完成，拼接所有片段的数据
          if (chunk.type === "add") {
            let data = JSON.parse(chunksReceived.join(""));
            let path = new fabric.Path(data, {
              stroke: "black",
              strokeWidth: 1,
              fill: ""
            });
            path.id = chunk.id;
            path.selectable = false;
            vm.canvas.add(path);
          } else if (chunk.type === "del") {
            let objects = vm.canvas.getObjects();
            for (let i = 0; i < objects.length; i++) {
              // 遍历所有对象
              if (objects[i].id === chunk.id) {
                // 判断对象id是否等于指定id
                vm.canvas.remove(objects[i]); // 从画布中删除该对象
                break; // 找到指定id的对象后跳出循环
              }
            }
          } else if (chunk.type === "clearBoard") {
            vm.clearEle();
          } else if (chunk.type === "getNumber") {
            vm.cntNumber = chunk.chunkData;
          }
          chunksReceived = [];
          chunksCount = 0;
        }
      };
    },
    sendMessage(action, target) {
      if (action === "clearBoard") {
        let message = {
          id: 1,
          type: action,
          totalChunks: 1,
          chunkIndex: 0,
          chunkData: ""
        };
        this.ws.send(JSON.stringify(message));
        return;
      }
      // 将数据按照一定的大小分成多个片段，并设置每个片段的编号和总片段数等信息
      let data = target.path;
      let chunkSize = 1024; // 每个片段的大小
      let dataStr = JSON.stringify(data);
      let totalChunks = Math.ceil(dataStr.length / chunkSize); // 总片段数
      for (let i = 0; i < totalChunks; i++) {
        let start = i * chunkSize;
        let end = (i + 1) * chunkSize;
        let chunkData = dataStr.substring(start, end);
        // 将每个片段的数据和信息封装成一个消息对象
        let message = {
          id: target.id,
          type: action,
          totalChunks: totalChunks,
          chunkIndex: i,
          chunkData: chunkData
        };
        // 使用WebSocket将消息发送给后端
        this.ws.send(JSON.stringify(message));
      }
    },
    //铅笔
    pencilMode() {
      this.pencilSelect = !this.pencilSelect;
      this.pencilCustomizeShow = true;
      this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
    },
    //根据id获取画板中的元素
    getElementById(id) {
      for (const element of this.canvas.getObjects()) {
        if (element.id === id) {
          return element;
        }
      }
      return null;
    },
    //随机获取id
    randomId() {
      return Math.floor(Math.random() * 100000000);
    },
    //清除画板
    clearBord() {
      this.clearEle();
      this.sendMessage("clearBoard", "");
    },
    clearEle() {
      this.actions = [];
      this.unActions = [];
      let objects = this.canvas.getObjects();
      for (var i = 0; i < objects.length; i++) {
        // 遍历所有对象
        this.canvas.remove(objects[i]);
      }
    },
    //撤销操作
    undo() {
      let obj = this.actions.pop();
      if (obj !== undefined) {
        let type = "";
        if (obj.type === "add") {
          let objects = this.canvas.getObjects();
          for (var i = 0; i < objects.length; i++) {
            // 遍历所有对象
            if (objects[i].id === obj.id) {
              // 判断对象id是否等于指定id
              this.canvas.remove(objects[i]); // 从画布中删除该对象
              break; // 找到指定id的对象后跳出循环
            }
          }
          type = "del";
        } else if (obj.type === "del") {
          let path = new fabric.Path(obj.path, {
            stroke: "black",
            strokeWidth: 1,
            fill: ""
          });
          this.canvas.add(path);
          type = "add";
        }
        this.unActions.push(obj);
        this.sendMessage(type, obj);
      }
    },
    //恢复操作
    redo() {
      let obj = this.unActions.pop();
      if (obj !== undefined) {
        if (obj.type === "del") {
          let objects = this.canvas.getObjects();
          for (let i = 0; i < objects.length; i++) {
            // 遍历所有对象
            if (objects[i].id === obj.id) {
              // 判断对象id是否等于指定id
              this.canvas.remove(objects[i]); // 从画布中删除该对象
              break; // 找到指定id的对象后跳出循环
            }
          }
        } else if (obj.type === "add") {
          let path = new fabric.Path(obj.path, {
            stroke: "black",
            strokeWidth: 1,
            fill: ""
          });
          path.id = obj.id;
          path.selectable = false;
          this.canvas.add(path);
        }
        this.actions.push(obj);
        this.sendMessage(obj.type, obj);
      }
    },
    toHome() {
      window.close();
      this.$router.push("/home");
    },
    startGetUserCountTimer() {
      // 页面可能断开连接后重连,要重启计时器
      console.log("定时器");
      clearInterval(this.userCountTimerId);
      let vm = this;
      this.userCountTimerId = setInterval(function() {
        vm.sendMessage("getNumber", "");
      }, 3000);
    }
  },
  mounted() {
    this.createCanvas();
    this.connectWs();
    // this.startGetUserCountTimer();
  },
  beforeDestroy() {
    this.ws.close();
  }
};
</script>

<style>
.bodyMain {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
}
html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
}
/* 欢迎界面 */
.join {
  width: 60%;
  height: 60%;
  z-index: 20;
  border-radius: 9px;
  margin: 10% 20% 30% 20%;
  display: none;
}
/* 欢迎界面图片 */
.title {
  height: 73%;
  background: url("https://naivewhiteboard.oss-cn-shanghai.aliyuncs.com/img/welcome.jpeg")
    center / cover;
}
/* 屏蔽层 */
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #b2ebf2;
  z-index: 15;
}
/* 控制区 */
.controls {
  width: 40px;
  left: 5px;
  z-index: 10;
  position: absolute;
  display: inline-block;
  background-color: white;
  border-radius: 6px;
}
/* 切换页面区 */
.controls.top {
  width: 100%;
  left: 0;
  height: 30px;
  border-radius: 0;
  background-color: #eeeeee;
}
/* 自定义窗口 */
.customize {
  width: 290px;
  right: 5px;
  z-index: 10;
  position: absolute;
  background-color: white;
  border-radius: 6px;
  top: 35px;
}
/* 自定义窗口的元素 */
.option {
  margin: 5%;
}
/* 人数显示 */
.users {
  right: 5px;
  bottom: 5px;
  z-index: 10;
  position: absolute;
  background-color: #ffffff;
}
/* 添加页面动画 */
@keyframes add {
  0% {
    width: 0;
  }
  100% {
    width: 150px;
  }
}
@keyframes remove {
  0% {
    width: 150px;
  }
  100% {
    width: 0;
  }
}
/* 页面div */
.page {
  height: 30px;
  width: 150px;
  background-color: #ffffff;
  margin-right: 3px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 9px 9px 0 0;
  /* 添加时的动画 */
  animation-name: add;
  animation-duration: 0.3s;
}
/* 页面名称 */
.page-name {
  text-overflow: clip;
  overflow: hidden;
  white-space: nowrap;
  width: 108px;
  height: 100%;
  display: inline-block;
  line-height: 30px;
  padding-left: 10px;
  text-align: left;
  cursor: pointer;
}
/* 已选中的Page */
.page-select {
  background-color: #e0e0e0 !important;
}
/* 关闭页面按钮 */
span.page-close {
  font-size: 18px;
  font-weight: 600;
  line-height: 30px;
  position: absolute;
  height: 100%;
  display: inline-block;
  margin: 0 5px 0 5px;
  cursor: pointer;
}
/* 添加页面按钮 */
span.page-add {
  font-size: 22px;
  line-height: 30px;
  position: absolute;
  margin: 0 6px 0 6px;
  cursor: pointer;
}
/* 功能按钮 */
span.tool {
  cursor: pointer;
  margin: 7px;
  font-size: 26px;
}
/* 已选中的功能按钮(铅笔) */
span.select {
  color: #2196f3;
}
/* 白板 */
.board {
  width: 100%;
  height: 100%;
}
/* 推送区 */
#toastBar {
  z-index: 20;
}
/* Google Material Icon */
@font-face {
  font-family: "Material Symbols Outlined";
  font-style: normal;
  font-weight: 500;
  src: url("https://naivewhiteboard.oss-cn-shanghai.aliyuncs.com/woff/material_outline.woff2")
    format("woff2");
}
.material-symbols-outlined {
  font-family: "Material Symbols Outlined", serif;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
</style>
