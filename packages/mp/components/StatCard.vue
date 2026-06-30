<template>
  <view class="stat-card" :style="cardStyle">
    <text class="stat-card__label">{{ params.label }}</text>
    <view class="stat-card__value-row">
      <text class="stat-card__value" :style="{ color: params.color }">{{ params.value }}</text>
      <text v-if="params.unit" class="stat-card__unit">{{ params.unit }}</text>
    </view>
    <view class="stat-card__bar">
      <view class="stat-card__bar-inner" :style="{ width: `${progressPercent}%`, backgroundColor: params.color }" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 统计卡片 - 挂载 params 对象渲染
 */
import { computed } from 'vue';
import { DEFAULT_STAT_CARD_PARAMS, type StatCardParams } from '@/types/component';
import { THEME_COLOR_CONFIG, SIZE_CONFIG } from '@/config';

const props = withDefaults(defineProps<{
  params?: Partial<StatCardParams>;
}>(), {
  params: () => ({}),
});

const merged = computed<StatCardParams>(() => ({ ...DEFAULT_STAT_CARD_PARAMS, ...props.params }));

const cardStyle = computed(() => ({
  borderRadius: `${SIZE_CONFIG.cardRadius}rpx`,
  backgroundColor: THEME_COLOR_CONFIG.bgCard,
  padding: `${SIZE_CONFIG.cardPadding}rpx`,
}));

const progressPercent = computed(() => {
  const p = merged.value.progress;
  if (p < 0) return 0;
  if (p > 1) return 100;
  return Math.round(p * 100);
});
</script>

<style scoped>
.stat-card { width: 100%; box-sizing: border-box; }
.stat-card__label { font-size: 24rpx; color: #666666; }
.stat-card__value-row { display: flex; align-items: baseline; margin: 8rpx 0 12rpx; }
.stat-card__value { font-size: 48rpx; font-weight: 700; }
.stat-card__unit { font-size: 24rpx; color: #999999; margin-left: 8rpx; }
.stat-card__bar { width: 100%; height: 8rpx; background-color: #EEEEEE; border-radius: 4rpx; overflow: hidden; }
.stat-card__bar-inner { height: 100%; transition: width 0.3s ease; }
</style>
