<template>
  <view class="section-title">
    <text class="section-title__text">{{ params.text }}</text>
    <text v-if="params.showAll" class="section-title__all">{{ params.allText }}</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 区段标题 - 挂载 params 对象渲染
 */
import { computed } from 'vue';
import { DEFAULT_SECTION_TITLE_PARAMS, type SectionTitleParams } from '@/types/component';

const props = withDefaults(defineProps<{
  params?: Partial<SectionTitleParams>;
}>(), {
  params: () => ({}),
});

const merged = computed<SectionTitleParams>(() => ({ ...DEFAULT_SECTION_TITLE_PARAMS, ...props.params }));
void merged;
</script>

<style scoped>
.section-title { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 0; }
.section-title__text { font-size: 32rpx; font-weight: 600; color: #333333; }
.section-title__all { font-size: 24rpx; color: #999999; }
</style>
