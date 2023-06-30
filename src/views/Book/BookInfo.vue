<template>
  <div class="book-info">
    <van-row justify="center">
      <div style="width: 28vw; height: 11vh">
        <img src="@/assets/info.png" style="height: 100%; width: 100%" />
      </div>
    </van-row>
    <van-row justify="center">
      <div style="margin-top: 2vh; font-size: 16px; font-family: 700">
        预约申请已发送，请等待对方审核！
      </div>
    </van-row>
    <van-row justify="center">
      <div class="book-info-detail">
        <van-row style="margin-bottom: 2.2vh">
          <van-col span="6" class="col-color">受访单位</van-col>
          <van-col span="15" offset="2" style="text-align: right">
            {{ bookInfo.companyName }}
          </van-col>
        </van-row>
        <van-row>
          <van-col span="6" class="col-color">预约时间</van-col>
          <van-col span="15" offset="2" style="text-align: right">
            {{ bookInfo.visitStartTime }}
          </van-col>
          <van-col span="15" offset="8" style="text-align: right">
            {{ bookInfo.visitEndTime }}
          </van-col>
        </van-row>
      </div>
    </van-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

// 路由传递的参数
let bookInfo = reactive({
  companyName: '',
  visitStartTime: '',
  visitEndTime: ''
});

const route = useRoute();
// 更新路由值
bookInfo = {
  ...bookInfo,
  ...JSON.parse(route.query.bookInfo as string)
};
</script>

<style lang="scss" scoped>
.book-info {
  padding: 5vh 5vw;
}

.van-row .van-col {
  font-size: 13px;
}

.col-color {
  color: rgb(137, 137, 137);
}

// 预约信息
.book-info-detail {
  width: 100%;
  height: 8vh;
  border: 1px solid #edebf0;
  margin-top: 3vh;
  padding: 2vh 0;
  border-radius: 10px;
}
</style>
