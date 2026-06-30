<template>
  <button
    class="base-button"
    :class="[`base-button--${params.type}`, `base-button--${params.size}`, { 'base-button--block': params.block, 'base-button--disabled': params.disabled }]"
    :style="buttonStyle"
    :disabled="params.disabled || params.loading"
    @click="handleClick"
  >
    <span v-if="params.loading" class="base-button__loading">·</span>
    <span class="base-button__text">{{ params.text }}</span>
  </button>
</template>

<script setup lang="ts">
/**
 * 基础按钮 - 挂载 params 对象渲染，DEFAULT 兜底
 */
import { computed } from 'vue';
import {
  DEFAULT_BUTTON_PARAMS,
  BUTTON_COLOR_MAP,
  type BaseButtonParams,
} from '@/types/component';
import { THEME_COLOR_CONFIG, SIZE_CONFIG } from '@/config';

const props = withDefaults(defineProps<{
  params?: Partial<BaseButtonParams>;
}>(), {
  params: () => ({}),
});

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void;
}>();

const merged = computed<BaseButtonParams>(() => ({ ...DEFAULT_BUTTON_PARAMS, ...props.params }));

const buttonStyle = computed(() => ({
  backgroundColor: BUTTON_COLOR_MAP[merged.value.type],
  borderRadius: `${SIZE_CONFIG.buttonRadius}rpx`,
  color: merged.value.type === 'default' ? THEME_COLOR_CONFIG.textPrimary : '#FFFFFF',
}));

function handleClick(ev: MouseEvent): void {
  if (merged.value.disabled || merged.value.loading) return;
  emit('click', ev);
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
  border: none;
  font-size: 28rpx;
  line-height: 1.4;
}
.base-button--small { font-size: 24rpx; padding: 8rpx 20rpx; }
.base-button--medium { font-size: 28rpx; padding: 16rpx 32rpx; }
.base-button--large { font-size: 32rpx; padding: 24rpx 48rpx; }
.base-button--block { display: flex; width: 100%; }
.base-button--disabled { opacity: 0.5; }
.base-button__loading { margin-right: 8rpx; }
</style>
