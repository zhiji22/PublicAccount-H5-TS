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
    <van-row>
      <div class="invite-info">
        <van-row style="margin-bottom: 2vh">
          <van-col span="6" class="col-color ta-left">来访人</van-col>
          <van-col span="15" offset="2" class="ta-right">
            {{ inviteInfo.appointName }}
          </van-col>
        </van-row>
        <van-row style="margin-bottom: 2vh">
          <van-col span="6" class="col-color ta-left">来访人电话</van-col>
          <van-col span="15" offset="2" class="ta-right">
            {{ inviteInfo.appointPhone }}
          </van-col>
        </van-row>
        <van-row>
          <van-col span="6" class="col-color ta-left">预约时间</van-col>
          <van-col span="15" offset="2" class="ta-right">
            {{ inviteInfo.visitStartTime }}
          </van-col>
          <van-col span="15" offset="8" class="ta-right">
            {{ inviteInfo.visitEndTime }}
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
let inviteInfo = reactive({
  appointName: '',
  appointPhone: '',
  visitStartTime: '',
  visitEndTime: ''
});

const route = useRoute();
// 更新路由值
inviteInfo = {
  ...inviteInfo,
  ...JSON.parse(route.query.inviteInfo as string)
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

// 来访人信息s
.invite-info {
  width: 100%;
  height: 12vh;
  border: 1px solid #edebf0;
  margin-top: 3vh;
  padding: 2vh 3vw;
  border-radius: 10px;
}

// 字体
.ta-left {
  text-align: left;
}
.ta-right {
  text-align: right;
}
</style>
