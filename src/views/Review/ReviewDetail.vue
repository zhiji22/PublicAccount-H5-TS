<!--
 * @Description: 
 * @Author: wanghong
 * @Date: 2023-06-27 16:28:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-29 17:04:52
-->
<template>
  <div class="review-detail">
    <div>
      <!-- 受访信息 -->
      <div style="margin-bottom: 20px">
        <van-row>
          <van-col class="info-text">受访信息</van-col>
        </van-row>
        <div style="border: 1px solid #edebf0; border-radius: 10px">
          <van-row class="row-padding">
            <van-col>
              <span class="span-color span-fs">受访人姓名</span>
              <span class="ml-10">{{ reviewInfo.visitPerson }}</span>
            </van-col>
          </van-row>
          <van-divider style="margin-bottom: 0" />
          <van-row class="row-padding" style="padding-bottom: 2vh">
            <van-col>
              <span class="span-color span-fs">受访人电话</span>
              <span class="ml-10">{{ reviewInfo.visitPersonPhone }}</span>
            </van-col>
          </van-row>
        </div>
      </div>
      <!-- 来访信息 -->
      <div style="margin-bottom: 20px">
        <van-row>
          <van-col class="info-text">来访信息</van-col>
        </van-row>
        <div style="border: 1px solid #edebf0; border-radius: 10px">
          <van-row class="row-padding">
            <van-col>
              <span class="span-color span-fs">来访人姓名</span>
              <span class="ml-10">{{ reviewInfo.appointName }}</span>
            </van-col>
          </van-row>
          <van-divider style="margin-bottom: 0" />
          <van-row class="row-padding">
            <van-col>
              <span class="span-color span-fs">来访人电话</span>
              <span class="ml-10">{{ reviewInfo.appointPhone }}</span>
            </van-col>
          </van-row>
          <van-divider style="margin-bottom: 0" />
          <van-row class="row-padding">
            <van-col>
              <span class="span-color span-fs">访问原因</span>
              <span style="margin-left: 55px">
                {{ reviewInfo.visitReason }}
              </span>
            </van-col>
          </van-row>
          <van-divider style="margin-bottom: 0" />
          <van-row class="row-padding" style="padding-bottom: 2vh">
            <van-col
              :span="5"
              class="span-color span-fs"
              style="text-align: left"
            >
              来访时间
            </van-col>
            <van-col :span="15" style="margin-left: 4px">
              {{ reviewInfo.visitStartTime }}
            </van-col>
            <van-col :span="24" style="margin-left: 11px">
              {{ reviewInfo.visitEndTime }}
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <van-button @click="() => (showRejectPopup = true)">拒绝</van-button>
      <van-button type="primary" @click="handlePass">同意</van-button>
    </div>
    <!-- 弹出 -->
    <van-popup
      v-model:show="showRejectPopup"
      closeable
      position="bottom"
      :style="{ height: '40%', padding: '3vh 5vw' }"
    >
      <div class="reject-text">拒绝理由</div>
      <van-field
        v-model="reviewInfo.auditReason"
        placeholder="请输入拒绝理由"
        type="textarea"
        style="background-color: #f7f8fa; height: 22.5vh; border-radius: 5px"
      />
      <div class="btn-box">
        <van-button @click="() => (showRejectPopup = false)">取消</van-button>
        <van-button type="primary" @click="handleConfirmReject">
          确定
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { rejectAudit, passAudit } from '@/api/review';
import { showNotify } from 'vant';
import router from '@/router';

const route = useRoute();

interface reviewField {
  id: string;
  auditReason: string;
  appointName: string;
  appointPhone: string;
  visitReason: string;
  visitStartTime: string;
  visitEndTime: string;
  visitPerson: string;
  visitPersonPhone: string;
}

let reviewInfo = ref<reviewField>();

reviewInfo.value = JSON.parse(route.params.reviewInfo as string);

// 拒绝弹出层
const showRejectPopup = ref(false);

// 确定拒绝
const handleConfirmReject = () => {
  if (!reviewInfo.value.auditReason) {
    showNotify({ type: 'warning', message: '请输入拒绝理由！' });
    return;
  }

  rejectAudit({
    id: reviewInfo.value.id,
    auditReason: reviewInfo.value.id,
    phoneNumber: reviewInfo.value.visitPersonPhone
  })
    .then((res) => {
      console.log(res);
      if (!res.code) {
        showNotify({ type: 'success', message: res.errMsg });
        showRejectPopup.value = false;

        router.push({
          name: 'reviewView',
          query: {
            phoneNumber: reviewInfo.value.visitPersonPhone
          }
        });
      }
    })
    .catch((err) => {
      showNotify({ type: 'danger', message: err.message });
    });
};

// 同意
const handlePass = () => {
  passAudit({
    id: reviewInfo.value.id,
    phoneNumber: reviewInfo.value.visitPersonPhone
  })
    .then((res) => {
      if (!res.code) {
        showNotify({ type: 'success', message: res.errMsg });

        router.push({
          name: 'reviewView',
          query: {
            phoneNumber: reviewInfo.value.visitPersonPhone
          }
        });
      }
    })
    .catch((err) => {
      showNotify({ type: 'danger', message: err.message });
    });
};
</script>

<style lang="scss" scoped>
.review-detail {
  padding: 3vh 5vw;
}

// 受访信息
.info-text {
  font-size: 17px;
  margin-bottom: 10px;
  color: #636363;
}

// 按钮
.btn-box {
  position: fixed;
  bottom: 15px;
  left: 0;
  right: 0;
  .van-button {
    width: 43vw;
    &:first-of-type {
      margin-right: 10px;
    }
  }
}

// 拒绝理由文本
.reject-text {
  font-size: 23px;
  font-weight: 500;
  text-align: left;
  padding-bottom: 2vh;
}

// === common style ===
// 颜色
.span-color {
  color: #636363;
}
// 左边距
.ml-10 {
  margin-left: 10vw;
}
// van-row 内边距
.row-padding {
  padding: 2vh 3vw 0;
}
// span标签 字体大小
.span-fs {
  font-size: 14px;
}
</style>
