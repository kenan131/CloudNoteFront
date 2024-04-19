<template>
  <div style="margin-top: 100px">
    <el-card class="box-card" style="background-color: rgb(253, 253, 253)">
      <div align="center">
        <div class="markideaname">
          <strong>{{ pageTitle }}</strong>
        </div>
      </div>
      <el-form :model="formData" ref="form" v-show="!beSuccess">
        <el-form-item prop="account" :rules="formRules.account">
          <el-input
            maxlength="10"
            class="box-input"
            v-model="formData.account"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item prop="email" :rules="formRules.email">
          <el-input
            class="box-input"
            v-model="formData.email"
            placeholder="邮箱"
          />
        </el-form-item>
        <el-form-item prop="captcha" :rules="formRules.captcha">
          <el-input
            class="box-input"
            v-model="formData.captcha"
            placeholder="验证码"
            style="width: 210px"
          />
          <el-button
            @click="sendCaptcha"
            v-bind:disabled="dis"
            style="float: right; padding: 13px; width: 120px"
          >
            <span v-if="!beSend">获取验证码</span>
            <span v-else>重新发送({{ captchaTime }}秒)</span>
          </el-button>
        </el-form-item>
        <div class="box-btn">
          <el-button @click="back">返回</el-button>
          <el-button @click="handleReCaptcha" style="width: 240px"
            >验证</el-button
          >
        </div>
      </el-form>
      <el-form :model="passwordData" v-show="beSuccess">
        <el-form-item prop="password">
          <el-input
            class="box-input"
            type="password"
            v-model="passwordData.password1"
            placeholder="新密码"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="box-input"
            type="password"
            v-model="passwordData.password2"
            placeholder="再输入一次密码"
          />
        </el-form-item>
        <div class="box-btn">
          <el-button @click="handleRePassword" style="width: 240px"
            >重置</el-button
          >
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { rePasswordCaptchaApi, rePasswordApi,checkCaptchaApi } from "../api/UserApi.js";
export default {
  name: "rePassword",
  data() {
    return {
      pageTitle: "云笔记管理系统",
      formData: {
        account: "",
        password: null,
        email: "",
        captcha: null
      },
      passwordData: {
        password1: "",
        password2: ""
      },
      formRules: {
        account: [
          { required: true, message: "不能为空" },
          {
            pattern: /^[A-Za-z0-9]{5,16}$/,
            message: "请输入6到16位数的账号(不包含特殊字符)"
          }
        ],
        email: [
          { required: true, message: "不能为空" },
          {
            pattern: /^\w+@[\da-z\.-]+\.([a-z]{2,6}|[\u2E80-\u9FFF]{2,3})$/,
            message: "请输入正确的邮箱格式"
          }
        ],
        captcha: [
          { required: false, message: "不能为空" },
          { pattern: /^[A-Za-z0-9!@#$^]{6}$/, message: "验证码为6位" }
        ]
      },
      beSend: false,
      captchaTime: 0,
      dis: false,
      timer: null,
      beSuccess: false
    };
  },
  methods: {
    handleReCaptcha() {
      this.$refs.form.validate(valid => {
        if (valid) {
          checkCaptchaApi(this.formData).then(res => {
            let { type, message } = res.data;
            if (type === "S") {
              this.$message({
                showClose: true,
                message: "验证成功，请输入新密码",
                type: "success"
              });
              this.beSuccess = true;
            }
          });
        }
      });
    },
    handleRePassword() {
      if (
        this.passwordData.password1.length === 0 ||
        this.passwordData.password2.length === 0
      ) {
        this.$message({
          showClose: true,
          message: "请全部输入数据。",
          type: "error"
        });
        return;
      }
      if (this.passwordData.password1 != this.passwordData.password2) {
        this.$message({
          showClose: true,
          message: "两次输入的密码不正确。",
          type: "error"
        });
        return;
      }
      let data  = {
        account:this.formData.account,
        password:this.passwordData.password1
      }
      rePasswordApi(data)
        .then(res => {
          let { type, message } = res.data;
          if (type === "S") {
            this.$message({
              showClose: true,
              message: "密码重置成功，请登录。",
              type: "success"
            });
            this.beSuccess=false;
            this.$router.push("/login");
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    sendCaptcha() {
      this.$refs.form.validate(valid => {
        if (valid) {
          rePasswordCaptchaApi(this.formData)
            .then(res => {
              let { type, message } = res.data;
              if (type === "S") {
                this.$message({
                  showClose: true,
                  message: "验证码发送成功，请注意查看邮箱。",
                  type: "success"
                });
              }
            })
            .catch(err => {
              console.error(err);
            });
          //验证码冷却时间
          let TIME_COUNT = 60;
          if (!this.timer) {
            this.captchaTime = TIME_COUNT;
            this.dis = true;
            this.beSend = true;
            this.timer = setInterval(() => {
              if (this.captchaTime > 0 && this.captchaTime <= TIME_COUNT) {
                this.captchaTime--;
              } else {
                this.dis = false;
                this.beSend = false;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        }
      });
    },
    back(){
      history.back();
    }
  }
};
</script>
<style scoped>
.box-btn {
  margin-bottom: 10px;
  margin-top: 10px;
}

.box-card {
  max-width: 380px;
  margin: 0 auto;
}

.markideaname {
  font-size: 30px;
  min-width: 200px;
  /* border-bottom-style: solid;
    border-width: 1px;
    border-color: lightgray; */
  padding-bottom: 10px;
  margin: 10px;
}
</style>
