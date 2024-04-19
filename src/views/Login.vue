<template>
  <div style="margin-top: 100px">
    <el-card class="boxCard" style="background-color: rgb(253, 253, 253)">
      <div align="center">
        <div class="markideaname">
          <strong>{{ pageTitle }}</strong>
        </div>
      </div>
      <div align="center" class="box-img">📕</div>
      <el-form :model="formData" @keyup.enter.native="handleLogin" ref="form">
        <el-form-item prop="account" :rules="formRules.account">
          <el-input
            maxlength="10"
            class="box-input"
            v-model="formData.account"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item prop="password" :rules="formRules.password">
          <el-input
            class="box-input"
            type="password"
            v-model="formData.password"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item prop="captcha" :rules="formRules.captcha">
          <el-input
            class="box-input"
            v-model="formData.captcha"
            placeholder="验证码"
            style="width: 200px"
          />
          <div style="float: right; width: 100px">
            <img
              ref="vcImg"
              :src="baseUrl"
              alt="验证码"
              @click="getCaptcha"
            />
          </div>
        </el-form-item>
        <div class="box-btn">
          <el-button @click="handleLogin" type="primary">登录</el-button>
          <el-button @click="handleRegister">注册</el-button>
          <el-button @click="handleRePassword">忘记密码</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { loginApi } from "../api/UserApi.js";
import { setToken } from "../utils/token.js";
export default {
  name: "login",
  data() {
    return {
      pageTitle: "云笔记管理系统",
      baseUrl:'http://localhost:8088/user/captcha',//开发环境
        // baseUrl:'http://192.168.101.65:8088/user/captcha',//部署环境
      formData: {
        account: null,
        password: null,
        captcha: null
      },
      random:null,
      formRules: {
        account: [
          { required: true, message: "不能为空" },
          {
            pattern: /^[A-Za-z0-9]{5,16}$/,
            message: "请输入6到16位数的账号(不包含特殊字符)",
          },
        ],
        password: [
          { required: true, message: "不能为空" },
          {
            pattern: /^[A-Za-z0-9!@#$^]{5,16}$/,
            message: "请输入4到16位数的密码(包含特殊字符)",
          },
        ],
        captcha: [
          { required: true, message: "不能为空" },
          {
            pattern: /^[A-Za-z0-9!@#$^]{4}$/,
            message: "请输入4位数验证码",
          },
        ],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formData.random = this. random;
          loginApi(this.formData)
            .then((res) => {
              let { type, message } = res.data;
              if (type === "S") {
                setToken("token", res.data.message);
                this.$message({
                  showClose: true,
                  message: "登录成功！",
                  type: "success",
                });
                this.$router.push("/home");
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    },
    handleRegister() {
      this.$router.push("/register");
    },
    getCaptcha() {
      // this.$refs.vcImg.src = "http://localhost:8088/user/captcha?" + Math.random();
      this.random = Math.random();
      this.$refs.vcImg.src = this.baseUrl + "?random=" + this.random;
    },
    handleRePassword(){
      this.$router.push("/rePassword");
    }
  },
};
</script>
<style scoped>
.box-btn {
  float: right;
  margin-bottom: 10px;
  margin-top: 10px;
}

.boxCard {
  max-width: 380px;
  margin: 0 auto;
}

.box-img {
  margin: 0 auto;
  width: 160px;
  font-size: 100px;
  height: 100px;
  margin-top: 60px;
}
.markideaname {
  font-size: 30px;
  min-width: 200px;
  border-bottom-style: solid;
  border-width: 1px;
  border-color: lightgray;
  padding-bottom: 15px;
}
</style>
