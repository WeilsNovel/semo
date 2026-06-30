<template>
  <view class="empty-state">
    <text class="empty-state__icon">{{ params.icon }}</text>
    <text class="empty-state__text">{{ params.text }}</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 空状态 - 挂载 params 对象渲染
 */
import { computed } from 'vue';
import { DEFAULT_EMPTY_PARAMS, type EmptyStateParams } from '@/types/component';
import { THEME_COLOR_CONFIG } from '@/config';

const props = withDefaults(defineProps<{
  params?: Partial<EmptyStateParams>;
}>(), {
  params: () => ({}),
});

const merged = computed<EmptyStateParams>(() => ({ ...DEFAULT_EMPTY_PARAMS, ...props.params }));
void merged; // 渲染已直接读 params，merged 保留以备未来扩展
void THEME_COLOR_CONFIG;
</script>

<style scoped>
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 80rpx 0; }
.empty-state__icon { font-size: 80rpx; margin-bottom: 16rpx; }
.empty-state__text { font-size: 26rpx; color: #999999; }
</style>
