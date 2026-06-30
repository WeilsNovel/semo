<template>
  <view class="base-card" :style="cardStyle">
    <view v-if="params.title" class="base-card__title">{{ params.title }}</view>
    <view v-if="params.title && params.showDivider" class="base-card__divider" />
    <view class="base-card__body">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 基础卡片 - 挂载 params 对象渲染
 */
import { computed } from 'vue';
import { DEFAULT_CARD_PARAMS, type BaseCardParams } from '@/types/component';
import { THEME_COLOR_CONFIG } from '@/config';

const props = withDefaults(defineProps<{
  params?: Partial<BaseCardParams>;
}>(), {
  params: () => ({}),
});

const merged = computed<BaseCardParams>(() => ({ ...DEFAULT_CARD_PARAMS, ...props.params }));

const cardStyle = computed(() => ({
  padding: `${merged.value.padding}rpx`,
  borderRadius: `${merged.value.radius}rpx`,
  backgroundColor: THEME_COLOR_CONFIG.bgCard,
}));
</script>

<style scoped>
.base-card { width: 100%; box-sizing: border-box; }
.base-card__title { font-size: 30rpx; font-weight: 600; color: #333333; }
.base-card__divider { height: 1rpx; margin: 16rpx 0; background-color: #EEEEEE; }
</style>
