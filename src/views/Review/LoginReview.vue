<template>
  <div class="container">
    <div class="bg-img">
      <div class="content">
        <van-row>
          <van-col style="font-size: 23px; font-family: bold">用户登录</van-col>
        </van-row>
        <van-row>
          <van-col style="font-size: 14px; color: #c3c3c3; text-align: left">
            企业用户验证个人手机号，完成手机号验证可使用企业服务
          </van-col>
        </van-row>
        <van-row>
          <van-col :span="24">
            <van-form>
              <van-cell-group>
                <van-field
                  v-model="phoneNumber"
                  :maxlength="11"
                  type="digit"
                  clearable
                  placeholder="请输入企业个人手机号"
                  :rules="[
                    {
                      required: true,
                      message: '请填写正确的手机号码',
                      pattern: /^1[3-9]\d{9}$/
                    }
                  ]"
                  style="
                    background-color: rgb(241, 241, 241);
                    margin-bottom: 10px;
                  "
                />
                <van-field
                  v-model="verificationCode"
                  type="digit"
                  :maxlength="11"
                  center
                  clearable
                  placeholder="请输入短信验证码"
                  style="width: 100%; background-color: rgb(241, 241, 241)"
                >
                  <template #extra>
                    <span style="color: #1989fa" @click="handleGetCode">
                      {{ codeText }}
                    </span>
                  </template>
                </van-field>
              </van-cell-group>
            </van-form>
          </van-col>
        </van-row>
        <van-row justify="center">
          <van-col>
            <van-button
              type="primary"
              style="width: 60vw; margin-top: 20px"
              @click="handleLogin"
            >
              登录
            </van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  getReviewPhoneNumberCode,
  checkReviewPhoneNumberCode
} from '@/api/review';
import router from '@/router';
import { showNotify } from 'vant';

// 企业个人手机号
const phoneNumber = ref('');
// 获取验证码
const codeText = ref('获取验证码');
// 发送验证码判断标志 避免用户重复点击
const isGetCodeNow = ref(false);
// 验证码 - 用户输入的
const verificationCode = ref('');

// 获取验证码
const handleGetCode = () => {
  // 验证手机号格式 是否正确
  const flag = /^1[3-9]\d{9}$/.test(phoneNumber.value);

  if (!flag) {
    showNotify({ type: 'warning', message: '手机格式不正确！' });
    return;
  }

  if (isGetCodeNow.value) {
    showNotify({ message: '请不要重复点击', type: 'warning' });
    return;
  }

  // isGetCodeNow 设置为 true，避免用户重复点击
  isGetCodeNow.value = true;
  // 手机格式正确 获取验证码
  getReviewPhoneNumberCode({
    phoneNumber: phoneNumber.value
  })
    .then((res) => {
      // 发送成功
      if (!res.code) {
        showNotify({ type: 'success', message: res.errMsg });
        // 倒计时几秒 如 60s
        let timeCode = 60;
        // 定时器间隔时间
        let startTime = 1000;

        const timer = setInterval(() => {
          timeCode--;

          codeText.value = `验证码已发送(${timeCode}s)`;

          // 关闭定时器
          if (!timeCode) {
            clearInterval(timer);
            codeText.value = '重新获取';
            isGetCodeNow.value = false;
          }
        }, startTime);
      }
    })
    .catch((err) => {
      showNotify({ type: 'danger', message: err.message });
    });
};

// 登录
const handleLogin = () => {
  // 判断用户是否输入验证码
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    showNotify({ type: 'danger', message: '请输入正确的验证码' });
    return;
  }
  checkReviewPhoneNumberCode({
    phoneNumber: phoneNumber.value,
    code: verificationCode.value
  })
    .then((res) => {
      // 验证码正确
      if (!res.code) {
        // 跳转到审批
        router.push({
          name: 'reviewView',
          query: {
            phoneNumber: phoneNumber.value
          }
        });
      }
    })
    .catch((err) => {
      showNotify({ type: 'warning', message: err.message });
    });
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-image: url('@/assets/bg.png');
  padding: 10vh 4vw;
  box-sizing: border-box;
}

// 中间内容部分
.content {
  width: 92vw;
  height: 88vh;
  background-color: #fff;
  border-radius: 10px;
  padding: 3vh 5vw;
  box-sizing: border-box;
}

.van-row {
  margin-bottom: 20px;
}
</style>
