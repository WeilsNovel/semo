<template>
  <view class="page page--record">
    <view class="page__header">
      <text class="page__title">{{ pageTitle }}</text>
      <text class="page__subtitle">{{ todayDateText }}</text>
    </view>

    <view class="page__body">
      <!-- 拍照入口 -->
      <view class="record__camera-area">
        <view v-if="!snapshotImage" class="record__camera-placeholder" @click="handleTakePhoto">
          <text class="record__camera-icon">{{ cameraIcon }}</text>
          <text class="record__camera-text">{{ takePhotoText }}</text>
        </view>
        <image v-else class="record__snapshot" :src="snapshotImage" mode="aspectFill" @click="handleTakePhoto" />
      </view>

      <!-- 识别结果 -->
      <BaseCard v-if="recognizeResult" :params="{ title: recognizeResultTitle }">
        <view class="record__result-summary">
          <text class="record__result-total">{{ recognizeResult.totalCalories }}</text>
          <text class="record__result-unit">kcal</text>
        </view>
        <view class="record__items">
          <FoodItemCard
            v-for="(item, idx) in recognizeResult.items"
            :key="idx"
            :params="toFoodItemParams(item)"
          />
        </view>

        <view class="record__meal-select">
          <text class="record__meal-label">{{ mealLabel }}</text>
          <view class="record__meal-tabs">
            <text
              v-for="opt in mealOptions"
              :key="opt.value"
              class="record__meal-tab"
              :class="{ 'record__meal-tab--active': selectedMealType === opt.value }"
              @click="selectedMealType = opt.value"
            >{{ opt.label }}</text>
          </view>
        </view>

        <BaseButton
          :params="{ text: saveRecordText, type: 'primary', block: true, loading: saving, disabled: saving }"
          @click="handleSaveRecord"
        />
      </BaseCard>

      <!-- 今日记录 -->
      <SectionTitle :params="{ text: todayRecordsTitle }" />
      <EmptyState v-if="todayRecords.length === 0" :params="{ text: emptyRecordsText }" />
      <view v-else class="record__today-list">
        <BaseCard
          v-for="rec in todayRecords"
          :key="rec.id"
          :params="{ title: mealTypeText(rec.mealType) + ' · ' + rec.totalCalories + 'kcal' }"
        >
          <view class="record__today-items">
            <text v-for="(it, idx) in rec.items" :key="idx" class="record__today-item">{{ it.name }} {{ it.weight }}g</text>
          </view>
        </BaseCard>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 拍照打卡主页 - 调用链：拍照 → uploadImage(food) → recognizeFood(url) → 用户确认 → createRecord → 当日记录
 * 契约对齐（mvp-v1 §四）：识别与落库分离，落库走 POST /record
 */
import { ref, onMounted } from 'vue';
import { BaseButton, BaseCard, EmptyState, SectionTitle, FoodItemCard } from '@/components';
import { recognizeFood } from '@/api/food';
import { uploadImage } from '@/api/upload';
import { getRecordList, createRecord } from '@/api/record';
import {
  MEAL_TYPE,
  UPLOAD_SCENE,
  type FoodRecognizeResponse,
  type FoodRecognizeItem,
  type RecordItem,
} from '@semo/shared';
import {
  DEFAULT_TEXT_CONFIG,
  MEAL_TYPE_TEXT_MAP,
  FOOD_CATEGORY_TEXT_MAP,
} from '@/config';
import type { FoodItemCardParams } from '@/types/component';

const pageTitle = DEFAULT_TEXT_CONFIG.appName;
const todayDateText = new Date().toISOString().slice(0, 10);
const cameraIcon = '📷';
const takePhotoText = '拍照打卡';
const recognizeResultTitle = '识别结果';
const mealLabel = '餐次';
const saveRecordText = '保存打卡';
const todayRecordsTitle = '今日记录';
const emptyRecordsText = '今天还没打卡，去拍一张吧';

const mealOptions: ReadonlyArray<{ value: number; label: string }> = [
  { value: MEAL_TYPE.BREAKFAST, label: MEAL_TYPE_TEXT_MAP[MEAL_TYPE.BREAKFAST] },
  { value: MEAL_TYPE.LUNCH, label: MEAL_TYPE_TEXT_MAP[MEAL_TYPE.LUNCH] },
  { value: MEAL_TYPE.DINNER, label: MEAL_TYPE_TEXT_MAP[MEAL_TYPE.DINNER] },
  { value: MEAL_TYPE.SNACK, label: MEAL_TYPE_TEXT_MAP[MEAL_TYPE.SNACK] },
];

const snapshotImage = ref<string>('');
const uploadedUrl = ref<string>('');
const recognizeResult = ref<FoodRecognizeResponse | null>(null);
const selectedMealType = ref<number>(MEAL_TYPE.LUNCH);
const saving = ref<boolean>(false);
const todayRecords = ref<RecordItem[]>([]);

function mealTypeText(mealType: number): string {
  return MEAL_TYPE_TEXT_MAP[mealType] ?? '未知';
}

function toFoodItemParams(item: FoodRecognizeItem): FoodItemCardParams {
  return {
    name: item.name,
    categoryText: FOOD_CATEGORY_TEXT_MAP[item.category] ?? '其他',
    weight: item.weight,
    calories: item.calories,
    confidence: item.confidence,
  };
}

async function handleTakePhoto(): Promise<void> {
  const chooseImage = (uni as unknown as {
    chooseImage: (opts: {
      count?: number;
      success?: (res: { tempFilePaths: string[] }) => void;
      fail?: (err: unknown) => void;
    }) => void;
  }).chooseImage;

  chooseImage({
    count: 1,
    success: (res) => {
      snapshotImage.value = res.tempFilePaths[0] ?? '';
      void runUploadAndRecognize();
    },
    fail: () => {
      // Mock 兜底：直接走 upload+recognize（mock 不依赖真实文件）
      snapshotImage.value = 'mock://placeholder.png';
      void runUploadAndRecognize();
    },
  });
}

/** 调用链：upload → recognize */
async function runUploadAndRecognize(): Promise<void> {
  try {
    uni.showLoading({ title: DEFAULT_TEXT_CONFIG.loading });
    // 1. 上传图片拿 url
    const uploadRes = await uploadImage(
      { tempFilePaths: [snapshotImage.value] },
      UPLOAD_SCENE.FOOD,
    );
    uploadedUrl.value = uploadRes.url;
    // 2. 用 url 调识别
    const result = await recognizeFood({
      image: uploadedUrl.value,
      imageType: 'url',
      mealType: selectedMealType.value,
    });
    recognizeResult.value = result;
  } catch (err) {
    void err;
  } finally {
    uni.hideLoading();
  }
}

async function handleSaveRecord(): Promise<void> {
  if (!recognizeResult.value) return;
  saving.value = true;
  try {
    await createRecord({
      mealType: selectedMealType.value as (typeof MEAL_TYPE)[keyof typeof MEAL_TYPE],
      items: recognizeResult.value.items,
      totalCalories: recognizeResult.value.totalCalories,
      imageUrl: uploadedUrl.value,
      recordDate: new Date().toISOString().slice(0, 10),
    });
    uni.showToast({ title: '打卡成功', icon: 'success' });
    recognizeResult.value = null;
    snapshotImage.value = '';
    uploadedUrl.value = '';
    await loadTodayRecords();
  } catch (err) {
    void err;
  } finally {
    saving.value = false;
  }
}

async function loadTodayRecords(): Promise<void> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const page = await getRecordList({ startDate: today, endDate: today });
    todayRecords.value = page.list;
  } catch (err) {
    void err;
  }
}

onMounted(() => {
  void loadTodayRecords();
});
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; box-sizing: border-box; background-color: #F5F6F8; }
.page__header { padding: 16rpx 0 24rpx; }
.page__title { display: block; font-size: 40rpx; font-weight: 700; color: #333333; }
.page__subtitle { display: block; font-size: 24rpx; color: #999999; margin-top: 8rpx; }
.page__body { display: flex; flex-direction: column; gap: 24rpx; }
.record__camera-area { width: 100%; height: 400rpx; border-radius: 16rpx; overflow: hidden; background-color: #FFFFFF; }
.record__camera-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16rpx; }
.record__camera-icon { font-size: 96rpx; }
.record__camera-text { font-size: 28rpx; color: #666666; }
.record__snapshot { width: 100%; height: 100%; }
.record__result-summary { display: flex; align-items: baseline; gap: 8rpx; margin-bottom: 16rpx; }
.record__result-total { font-size: 56rpx; font-weight: 700; color: #4CAF50; }
.record__result-unit { font-size: 24rpx; color: #999999; }
.record__items { display: flex; flex-direction: column; gap: 16rpx; margin-bottom: 24rpx; }
.record__meal-select { margin-bottom: 24rpx; }
.record__meal-label { display: block; font-size: 26rpx; color: #666666; margin-bottom: 12rpx; }
.record__meal-tabs { display: flex; gap: 16rpx; }
.record__meal-tab { padding: 8rpx 24rpx; border-radius: 24rpx; background-color: #F5F6F8; font-size: 24rpx; color: #666666; }
.record__meal-tab--active { background-color: #4CAF50; color: #FFFFFF; }
.record__today-list { display: flex; flex-direction: column; gap: 16rpx; }
.record__today-items { display: flex; flex-wrap: wrap; gap: 16rpx; }
.record__today-item { font-size: 24rpx; color: #666666; }
</style>
