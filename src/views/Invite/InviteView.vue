<template>
  <div class="container">
    <div>
      <div style="border-radius: 7px; overflow: hidden">
        <van-form>
          <van-cell-group>
            <van-field
              name="来访人信息"
              label="来访人信息"
              style="font-size: 15px; font-family: 700"
              input-align="right"
            />
            <van-field
              v-model="formVisit.appointName"
              name="姓名"
              label="姓名"
              placeholder="姓名"
              :rules="[{ required: true, message: '请填写姓名' }]"
              input-align="right"
            />
            <van-field
              name="radio"
              label="性别"
              input-align="right"
              :rules="[{ required: true, message: '请选择性别' }]"
            >
              <template #input>
                <van-radio-group
                  v-model="formVisit.gender"
                  direction="horizontal"
                >
                  <van-radio name="1" shape="square">男</van-radio>
                  <van-radio name="2" shape="square">女</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-model="formVisit.appointPhone"
              type="digit"
              name="电话"
              label="电话"
              placeholder="电话"
              input-align="right"
              :rules="[
                {
                  required: true,
                  message: '请填写正确的电话号码',
                  pattern: /^1[3-9]\d{9}$/
                }
              ]"
            />
            <van-field
              v-model="visitReasonText"
              is-link
              readonly
              name="picker"
              label="来访原因"
              placeholder="请选择来访原因"
              input-align="right"
              :rules="[{ required: true, message: '请选择来访原因' }]"
              style="height: 7vh"
              @click="handleReasonPopup"
            />
          </van-cell-group>
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker
              :columns="visiReasonList"
              @confirm="handleConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>

          <!-- 占位符 -->
          <div
            style="
              background-color: rgb(238, 238, 238);
              width: 100%;
              height: 2vh;
            "
          />
          <van-field
            name="访问时间"
            label="访问时间"
            style="
              font-size: 15px;
              font-family: 700;
              border-radius: 7px 7px 0 0;
            "
            input-align="right"
          />
          <van-field
            v-model="formCorp.date"
            is-link
            name="访问日期"
            label="访问日期"
            placeholder="请选择访问日期"
            :rules="[{ required: true, message: '请选择访问日期' }]"
            input-align="right"
            @click="() => (showAccessDate = true)"
          />
          <van-field
            v-model="formCorp.startTime"
            is-link
            name="开始时间"
            label="开始时间"
            placeholder="请选择开始时间"
            :rules="[{ required: true, message: '请选择开始时间' }]"
            input-align="right"
            @click="
              () => {
                showTimeSelect = true;
                timeSelectFlag = 'start';
              }
            "
          />
          <van-field
            v-model="formCorp.endTime"
            is-link
            name="结束时间"
            label="结束时间"
            placeholder="请选择结束时间"
            :rules="[{ required: true, message: '请选择结束时间' }]"
            input-align="right"
            style="border-radius: 0 0 7px 7px"
            @click="
              () => {
                showTimeSelect = true;
                timeSelectFlag = 'end';
              }
            "
          />
          <!-- 弹出层 访问日期 -->
          <van-popup v-model:show="showAccessDate" position="bottom">
            <van-date-picker
              title="选择日期"
              :max-hour="formCorp.endTime.split(':')[0]"
              :max-minute="formCorp.endTime.split(':')[1]"
              :min-date="new Date(minDate.join('-'))"
              @cancel="() => (showAccessDate = false)"
              @confirm="handleConfirmDate"
            />
          </van-popup>
          <!-- 弹出层 时间 -->
          <van-popup v-model:show="showTimeSelect" position="bottom">
            <van-time-picker
              title="选择时间"
              :min-hour="formCorp.startTime.split(':')[0]"
              :min-minute="formCorp.startTime.split(':')[1]"
              @cancel="() => (showTimeSelect = false)"
              @confirm="handleTimeSelectConfirm"
            />
          </van-popup>

          <!-- 占位符 -->
          <div
            style="
              background-color: rgb(238, 238, 238);
              width: 100%;
              height: 7vh;
            "
          />
          <div style="margin: 16px">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              style="width: 85vw; margin-left: -1.5vw"
              @click="handleInvite"
            >
              发起邀请
            </van-button>
          </div>
          <van-popup
            v-model:show="showCorpPopup"
            position="bottom"
            closeable
            style="height: 45vh"
          >
            <div style="padding: 12px 15px">
              <div class="select-unit">{{ popupTitle }}</div>
              <van-field
                placeholder="请输入关键词查询"
                right-icon="cross"
                style="background-color: rgb(246, 249, 248); margin-top: 12px"
                clearable
                @click-right-icon="() => handleCorpPopup()"
                @update:model-value="handleInputChange"
              />
              <van-list
                :v-model:loading="false"
                finished-text="没有更多了"
                style="height: 33vh; overflow: scroll"
              >
                <van-cell
                  v-for="item in BuildingOrCorpList"
                  :key="item.itemId"
                  :title="item.itemName"
                  @click="handleClickCell"
                />
              </van-list>
            </div>
          </van-popup>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onMounted } from 'vue';
import { getDictType, getCorpListInfo } from '@/api/book';
import { submitVisitInvite, checkUserLoginStatus } from '@/api/invite';
import router from '@/router';
import { showNotify } from 'vant';
import { useRoute } from 'vue-router';

const route = useRoute();

// 来访原因
const showPicker = ref(false);
// 受访单位
const showCorpPopup = ref(false);
// 访问时间
const showAccessDate = ref(false);
// 开始 -结束时间
const showTimeSelect = ref(false);
// 开始 结束时间选择标志
const timeSelectFlag = ref('');
// 受访单位
const BuildingOrCorpList = ref([]);
// 来访原因数据
const visiReasonList = ref<object[]>([]);
// 控制下一步按钮的状态
const enableOrDisableBtn = ref(true);
// 弹出层标题
const popupTitle = ref('');
// 来访原因文本
const visitReasonText = ref('');
// 最小访问日期
const minDate = ref([
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
]);
// 来访人信息 表单数据
const formVisit = reactive({
  appointName: '',
  gender: '',
  appointPhone: '',
  visitReason: ''
});
// 受访人信息 表单数据
const formCorp = reactive({
  date: '',
  endTime: '',
  startTime: '',
  visitStartTime: '',
  visitEndTime: '',
  visitPersonPhone: route.query.visitPersonPhone
});

// 保存手机号
localStorage.setItem(
  'invitePhoneNumber',
  route.query.visitPersonPhone as string
);

onMounted(() => {
  // 判断用户是否登录过期
  const phoneNumber = localStorage.getItem('invitePhoneNumber');
  if (phoneNumber) {
    const flag = 2;

    checkUserLoginStatus({
      flag,
      phoneNumber
    })
      .then((res) => {
        // 登录已过期
        if (res.code === 401) {
          showNotify({ type: 'warning', message: res.errMsg });
          router.push({ name: 'loginView' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// 监听form表单的变化 将下一步的按钮状态启用
watch(
  formVisit,
  (obj) => {
    const { appointName, gender, appointPhone, visitReason } = obj;
    // 判断必填的信息是否 都有值
    if (appointName && gender && appointPhone && visitReason) {
      // 判断电话号码格式
      enableOrDisableBtn.value = /^1[3-9]\d{9}$/.test(appointPhone)
        ? false
        : true;
    }
  },
  { deep: true }
);

const handleConfirm = ({ selectedOptions }) => {
  visitReasonText.value = selectedOptions[0]?.text;
  formVisit.visitReason = selectedOptions[0]?.dictValue;
  showPicker.value = false;
};

// 点击弹出层
const handleReasonPopup = async () => {
  showPicker.value = true;
  // 获取字典数据 来访原因
  try {
    const res = await getDictType({
      pageNum: 1,
      pageSize: 0,
      dictType: 'visit_reason'
    });
    visiReasonList.value = res.data.list.map((item) => {
      item.text = item.dictLabel;
      item.value = item.dictValue;
      return item;
    });
  } catch (err: any) {
    console.log(err.message);
  }
};

// 受访单位
const handleCorpPopup = async () => {
  popupTitle.value = '选择受访单位';
  showCorpPopup.value = true;
  try {
    // 获取受访单位列表
    const res = await getCorpListInfo();
    BuildingOrCorpList.value = res.data.map((item) => {
      item.itemId = item.corpId;
      item.itemName = item.corpName;
      return item;
    });
  } catch (err) {
    console.log(err.message);
  }
};

// 受访单位或 楼栋 发生变化时触发
const handleInputChange = (val) => {
  const data = [];
  // 匹配搜索结果
  if (BuildingOrCorpList.value.length) {
    BuildingOrCorpList.value.forEach((item) => {
      if (item.itemName.indexOf(val) > -1) data.push(item);
    });
    BuildingOrCorpList.value = data;
  }
};

// // 点击选择受访单位
const handleClickCell = () => {
  // // 受访单位
  // formCorp.corpName = item.corpName ? item.corpName : formCorp.corpName;
  // // 楼栋
  // formCorp.buildingName = item.buildingNo
  //   ? item.buildingNo
  //   : formCorp.buildingName;
  // // 关闭受访单位 弹出层
  // showCorpPopup.value = false;
};

// 确认访问日期
const handleConfirmDate = ({ selectedValues }) => {
  formCorp.date = selectedValues.join('-');
  showAccessDate.value = false;
};

// 确定选择时间
const handleTimeSelectConfirm = ({ selectedValues }) => {
  const time = selectedValues.join(':');

  // 判断当前选择的是 开始时间还是 结束时间
  if (timeSelectFlag.value === 'start') formCorp.startTime = time;
  else formCorp.endTime = time;

  // 关闭弹出层
  showTimeSelect.value = false;
};

// 发起邀约
const handleInvite = async () => {
  formCorp.visitStartTime = formCorp.date + ' ' + formCorp.startTime;
  formCorp.visitEndTime = formCorp.date + ' ' + formCorp.endTime;

  console.log({
    ...formVisit,
    ...formCorp
  });

  try {
    const res = await submitVisitInvite({
      ...formVisit,
      ...formCorp
    });
    console.log(res);
    router.push({
      name: 'QRCode',
      query: {
        id: res.data.id,
        appointName: formVisit.appointName
      }
    });
  } catch (err) {
    showNotify({ type: 'warning', message: err.message });
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 18%,
      rgb(238, 238, 238) 23%
    ),
    url('@/assets/bg.png');
  padding: 8vh 5vw 0;
}

// 选择受访单位
.select-unit {
  font-size: 16px;
  text-align: left;
}

// 受访单位列表
.van-list {
  .van-cell {
    text-align: left;
    padding: 10px 5px;
    color: rgb(136, 139, 140);
    &:hover {
      background-color: rgb(235, 242, 253);
    }
  }
}

// 受访单位 弹出层的 X
.van-popup {
  .van-popup__close-icon--top-right {
    top: 8px;
  }
}
</style>
