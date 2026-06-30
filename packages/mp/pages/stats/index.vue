<template>
  <view class="page page--stats">
    <view class="page__header">
      <text class="page__title">{{ pageTitle }}</text>
      <text class="page__subtitle">{{ statDateText }}</text>
    </view>

    <view class="page__body">
      <view v-if="loading" class="stats__loading">{{ loadingText }}</view>

      <template v-else>
        <!-- 总览 -->
        <StatCard :params="totalStatParams" />

        <!-- 三餐分布 -->
        <SectionTitle :params="{ text: mealBreakdownTitle }" />
        <BaseCard>
          <view v-if="mealBreakdownList.length === 0">
            <EmptyState />
          </view>
          <view v-else class="stats__breakdown-list">
            <view v-for="row in mealBreakdownList" :key="row.label" class="stats__breakdown-row">
              <text class="stats__breakdown-label">{{ row.label }}</text>
              <view class="stats__breakdown-bar">
                <view class="stats__breakdown-bar-inner" :style="{ width: `${row.percent}%` }" />
              </view>
              <text class="stats__breakdown-value">{{ row.value }}kcal</text>
            </view>
          </view>
        </BaseCard>

        <!-- 打卡次数 -->
        <BaseCard :params="{ title: recordCountTitle }">
          <text class="stats__record-count">{{ recordCountText }}</text>
        </BaseCard>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 当日统计页 - 总热量/目标/三餐分布，全 mock
 */
import { ref, computed, onMounted } from 'vue';
import { StatCard, SectionTitle, BaseCard, EmptyState } from '@/components';
import { getDailyStat } from '@/api/record';
import { MEAL_TYPE, type DailyStatResponse } from '@semo/shared';
import { DEFAULT_TEXT_CONFIG, MEAL_TYPE_TEXT_MAP, THEME_COLOR_CONFIG } from '@/config';
import type { StatCardParams } from '@/types/component';

const pageTitle = '今日统计';
const statDateText = new Date().toISOString().slice(0, 10);
const loadingText = DEFAULT_TEXT_CONFIG.loading;
const mealBreakdownTitle = '三餐分布';
const recordCountTitle = '打卡次数';

const loading = ref<boolean>(false);
const stat = ref<DailyStatResponse | null>(null);

const totalStatParams = computed<StatCardParams>(() => {
  if (!stat.value) {
    return {
      label: '今日热量',
      value: '0',
      unit: 'kcal',
      progress: 0,
      color: THEME_COLOR_CONFIG.primary,
    };
  }
  const progress = stat.value.targetCalories > 0
    ? stat.value.totalCalories / stat.value.targetCalories
    : 0;
  return {
    label: `今日热量 / 目标 ${stat.value.targetCalories}kcal`,
    value: String(stat.value.totalCalories),
    unit: 'kcal',
    progress,
    color: THEME_COLOR_CONFIG.primary,
  };
});

const mealBreakdownList = computed<Array<{ label: string; value: number; percent: number }>>(() => {
  if (!stat.value) return [];
  const entries = Object.entries(stat.value.mealBreakdown);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  return entries.map(([key, value]) => {
    const mealTypeNum = Number(key);
    const label = MEAL_TYPE_TEXT_MAP[mealTypeNum] ?? `餐次${mealTypeNum}`;
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return { label, value, percent };
  });
});

const recordCountText = computed(() => {
  return stat.value ? `${stat.value.recordCount} 次` : '0 次';
});

void MEAL_TYPE;

async function loadStat(): Promise<void> {
  loading.value = true;
  try {
    stat.value = await getDailyStat();
  } catch (err) {
    void err;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadStat();
});
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; box-sizing: border-box; background-color: #F5F6F8; }
.page__header { padding: 16rpx 0 24rpx; }
.page__title { display: block; font-size: 40rpx; font-weight: 700; color: #333333; }
.page__subtitle { display: block; font-size: 24rpx; color: #999999; margin-top: 8rpx; }
.page__body { display: flex; flex-direction: column; gap: 24rpx; }
.stats__loading { padding: 80rpx 0; text-align: center; font-size: 26rpx; color: #999999; }
.stats__breakdown-list { display: flex; flex-direction: column; gap: 20rpx; }
.stats__breakdown-row { display: flex; align-items: center; gap: 16rpx; }
.stats__breakdown-label { width: 80rpx; font-size: 26rpx; color: #666666; }
.stats__breakdown-bar { flex: 1; height: 12rpx; background-color: #EEEEEE; border-radius: 6rpx; overflow: hidden; }
.stats__breakdown-bar-inner { height: 100%; background-color: #4CAF50; }
.stats__breakdown-value { width: 120rpx; text-align: right; font-size: 24rpx; color: #333333; }
.stats__record-count { font-size: 40rpx; font-weight: 700; color: #4CAF50; }
</style>
