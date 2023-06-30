<template>
  <div class="container">
    <div class="review-content">
      <div class="content">
        <!-- <van-dialog
          v-model:show="showDialogInput"
          title="手机号"
          show-cancel-button
          :before-close="handleBeforeClose"
          @confirm="handleComfirmNumber"
        >
          <div style="padding: 2vh 3vw">
            <van-field
              v-model="queryParams.phoneNumber"
              type="digit"
              placeholder="请输入手机号"
              style="background-color: rgb(246, 249, 248); border-radius: 10px"
            />
          </div>
        </van-dialog> -->
        <van-tabs
          v-model:active="activeTab"
          type="card"
          @click-tab="handleClickTab"
        >
          <van-tab title="来访审批">
            <div
              v-for="item in formattedVisitList"
              :key="item.id"
              class="card-box"
              @click="handleReviewDetail(item)"
            >
              <van-row>
                <van-col class="fw-700">{{ item.date }}</van-col>
              </van-row>
              <van-row>
                <van-col class="fs-14" style="color: #595959">
                  {{ item.time }}
                </van-col>
              </van-row>
              <van-row>
                <van-col :span="12" class="ta-left">
                  <span class="span-info">来访人 </span>
                  <span class="fs-14">{{ item.visitPerson }}</span>
                </van-col>
                <van-col :span="12" class="ta-right">
                  <span class="span-info">来访类型 </span>
                  <span class="fs-14">{{ item.visitReason }}</span>
                </van-col>
              </van-row>
            </div>
            <div v-if="!formattedVisitList.length" style="color: #a1a1a1">
              暂无数据！
            </div>
          </van-tab>
          <van-tab title="历史记录">
            <div
              v-for="item in formattedHistoryList"
              :key="item.id"
              class="card-box"
            >
              <van-row>
                <van-col :span="16" class="ta-left fw-700">
                  {{ item.date }}
                </van-col>
                <van-col :span="8" class="ta-right fw-700">
                  <van-tag :type="item.statusColor">
                    {{ item.statusLabel }}
                  </van-tag>
                </van-col>
              </van-row>
              <van-row>
                <van-col class="fs-14" style="color: #595959">
                  {{ item.time }}
                </van-col>
              </van-row>
              <van-row>
                <van-col :span="12" class="ta-left">
                  <span class="span-info">来访人 </span>
                  <span class="fs-14">{{ item.visitPerson }}</span>
                </van-col>
                <van-col :span="12" class="ta-right">
                  <span class="span-info">来访类型 </span>
                  <span class="fs-14">{{ item.visitReason }}</span>
                </van-col>
              </van-row>
              <van-divider dashed />
              <van-row>
                <van-col :span="24" class="ta-left">
                  <span class="span-info">审批人 </span>
                  <span class="fs-14">{{ item.auditBy }}</span>
                </van-col>
              </van-row>
            </div>
            <div v-if="!formattedHistoryList.length" style="color: #a1a1a1">
              暂无数据！
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getMyAuditVisitList, getMyHistoryVisitList } from '@/api/review';
import { checkUserLoginStatus } from '@/api/invite';
import router from '@/router';
import { showNotify } from 'vant';
import { useRoute } from 'vue-router';

const route = useRoute();

// 当前选中的tab
const activeTab = ref(0);
// dialog
const showDialogInput = ref(false);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 9999,
  phoneNumber: route.query.phoneNumber as string
});
// 保存电话号码
localStorage.setItem('reviewPhoneNumber', route.query.phoneNumber as string);

// 来访审批数据
let visitList = ref([]);
// 历史记录
const historyList = ref([]);

window.addEventListener('DOMContentLoaded', () => {
  showDialogInput.value = true;
});

onMounted(() => {
  if (queryParams.phoneNumber) getVisitList();

  // 判断用户是否登录过期
  const phoneNumber = localStorage.getItem('reviewPhoneNumber');
  if (phoneNumber) {
    const flag = 1;

    checkUserLoginStatus({
      flag,
      phoneNumber
    })
      .then((res) => {
        // 登录已过期
        if (res.code === 401) {
          showNotify({ type: 'warning', message: res.errMsg });
          router.push({ name: 'loginReview' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// 使用computed属性来处理日期和时间的格式化，避免重复代码和多次计算
const formatDateAndTime = (item) => {
  const dateArr = ['日', '一', '二', '三', '四', '五', '六'];
  // 对日期和时间进行处理
  const startTime = item.visitStartTime.split(' ');

  // 日期: 06月03日 周二
  const day = new Date(startTime[0]).getDay();
  const date1 = '星期' + dateArr[day];
  // 处理几月几日
  const dates = startTime[0].split('-');
  const date2 = dates[1] + '月' + dates[2] + '号';

  item.date = date2 + ' ' + date1;
  // 时间: 00：00 - 01:00
  item.time = startTime[1] + ' - ' + item.visitEndTime.split(' ')[1];
};

// 使用computed属性来返回格式化后的来访审批数据
const formattedVisitList = computed(() => {
  return visitList.value.map((item) => {
    formatDateAndTime(item);
    return item;
  });
});

// 使用computed属性来返回格式化后的历史记录数据
const formattedHistoryList = computed(() => {
  return historyList.value.map((item) => {
    formatDateAndTime(item);

    // 标签颜色
    if (item.statusLabel === '未到访') item.statusColor = 'warning';
    else if (item.statusLabel === '已到访') item.statusColor = 'success';
    else item.statusColor = 'danger';

    return item;
  });
});

// 获取来访审批
const getVisitList = async () => {
  try {
    const res = await getMyAuditVisitList(queryParams);
    visitList.value = res.data.list;
  } catch (err) {
    showNotify({ type: 'warning', message: err.message });
  }
};

// 获取历史记录
const getHistoryList = async () => {
  try {
    const res = await getMyHistoryVisitList(queryParams);
    historyList.value = res.data.list;
  } catch (err) {
    showNotify({ type: 'warning', message: err.message });
  }
};

// 跳转到审批详情
const handleReviewDetail = (item: object) => {
  router.push({
    name: 'reviewDetail',
    params: {
      reviewInfo: JSON.stringify(item)
    }
  });
};

// // 确认输入手机号
// const handleComfirmNumber = () => {
//   // 判断是否是正确的手机号
//   const flag = /^1[3-9]\d{9}$/.test(queryParams.phoneNumber);

//   if (!flag) {
//     showNotify({ type: 'danger', message: '请输入正确的手机号' });

//     showDialogInput.value = true;
//     return;
//   }
// };

// const handleBeforeClose = (action) => {
//   if (action === 'confirm') {
//     // 判断是否是正确的手机号
//     const flag = /^1[3-9]\d{9}$/.test(queryParams.phoneNumber);

//     if (!flag) {
//       showNotify({ type: 'warning', message: '请输入正确的手机号' });

//       showDialogInput.value = true;
//       return;
//     }
//     // 获取数据
//     getVisitList();
//     showDialogInput.value = false;
//     // 获取数据
//   } else showDialogInput.value = false;
// };

// 切换标签
const handleClickTab = (tabObj) => {
  if (tabObj.name === 1) {
    getHistoryList();
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  box-sizing: border-box;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 18%,
      rgb(238, 238, 238) 23%
    ),
    url('@/assets/bg.png');
  padding: 10vh 0 0;
}

// 内容部分
.review-content {
  width: 100%;
  height: 100%;
  padding: 2vh 4vw;
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  box-sizing: border-box;
  // tab样式
  :deep(.van-tabs__wrap) {
    height: 3.3vh;
    margin-bottom: 2vh;
    margin-left: 20vw;
    .van-tabs__nav--card {
      width: 45vw;
      height: 100%;
      border-radius: 5px;
    }
  }
  // 每一个卡片信息
  .card-box {
    width: 100%;
    // height: 17vh;
    padding: 1.8vh 3vw 0;
    box-sizing: border-box;
    border: 1px solid #edebf0;
    border-radius: 10px;
    margin-bottom: 15px;
    .van-row {
      margin-bottom: 10px;
      .span-info {
        color: #919191;
        font-size: 13px;
      }
    }
  }
}

:deep(.van-divider--hairline:before, .van-divider--hairline:after) {
  transform: scaleY(1.2);
}

// 来访人和审批人 之间 线条
.van-divider {
  margin: 0 0 5px 0;
}

//  === common style ===
// 字体 14px
.fs-14 {
  font-size: 14px;
}
// 文字居中
.ta-left {
  text-align: left;
}
.ta-right {
  text-align: right;
}
// 字体样式
.fw-700 {
  font-weight: 700;
}
</style>
