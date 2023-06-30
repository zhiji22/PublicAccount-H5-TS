<!--
 * @Description: 
 * @Author: wanghong
 * @Date: 2023-06-28 17:15:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-28 20:57:29
-->
<template>
  <div class="qr-code">
    <div class="box">
      <van-image width="100%" height="100%" :src="QRCode" />
      <span>访客二维码</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { generateVisitQrCode } from '@/api/book';
import { useRoute } from 'vue-router';

// 二维码图片
const QRCode = ref('');
const route = useRoute();
// 生成二维码

generateVisitQrCode({
  id: route.query.id,
  appointName: route.query.appointName
})
  .then((res) => {
    QRCode.value = res.data;
  })
  .catch((err) => {
    console.log(err.message);
  });
</script>

<style lang="scss" scoped>
.qr-code {
  height: 100vh;
  padding: 20vh 15vw;
  background: url('@/assets/bg.png');
}

.box {
  height: 33vh;
  padding: 2vh 7vw 4.3vh;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  color: #8f8f8f;
}
</style>
