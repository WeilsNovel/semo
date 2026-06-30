<template>
  <view class="food-item-card">
    <view class="food-item-card__header">
      <text class="food-item-card__name">{{ params.name }}</text>
      <text class="food-item-card__category">{{ params.categoryText }}</text>
    </view>
    <view class="food-item-card__meta">
      <text class="food-item-card__meta-item">{{ params.weight }}g</text>
      <text class="food-item-card__meta-item">{{ params.calories }}kcal</text>
      <text class="food-item-card__meta-item">置信度 {{ confidencePercent }}%</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 食物项卡片 - 挂载 params 对象渲染
 */
import { computed } from 'vue';
import { DEFAULT_FOOD_ITEM_PARAMS, type FoodItemCardParams } from '@/types/component';
import { THEME_COLOR_CONFIG, SIZE_CONFIG } from '@/config';

const props = withDefaults(defineProps<{
  params?: Partial<FoodItemCardParams>;
}>(), {
  params: () => ({}),
});

const merged = computed<FoodItemCardParams>(() => ({ ...DEFAULT_FOOD_ITEM_PARAMS, ...props.params }));

const confidencePercent = computed(() => Math.round(merged.value.confidence * 100));

void THEME_COLOR_CONFIG;
void SIZE_CONFIG;
</script>

<style scoped>
.food-item-card { width: 100%; padding: 24rpx; box-sizing: border-box; background-color: #FFFFFF; border-radius: 16rpx; }
.food-item-card__header { display: flex; align-items: center; justify-content: space-between; }
.food-item-card__name { font-size: 30rpx; font-weight: 600; color: #333333; }
.food-item-card__category { font-size: 22rpx; color: #4CAF50; }
.food-item-card__meta { display: flex; gap: 24rpx; margin-top: 12rpx; }
.food-item-card__meta-item { font-size: 24rpx; color: #666666; }
</style>
