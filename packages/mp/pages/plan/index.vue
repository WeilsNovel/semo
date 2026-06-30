<template>
  <view class="page page--plan">
    <view class="page__header">
      <text class="page__title">{{ pageTitle }}</text>
      <text class="page__subtitle">{{ subtitle }}</text>
    </view>

    <view class="page__body">
      <EmptyState :params="{ icon: planIcon, text: planEmptyText }" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 计划页 - MVP 占位，计划生成在后续迭代实现
 */
import { EmptyState } from '@/components';
import { DEFAULT_TEXT_CONFIG } from '@/config';

const pageTitle = '我的计划';
const subtitle = 'AI 计划生成即将上线';
const planIcon = '🎯';
const planEmptyText = DEFAULT_TEXT_CONFIG.empty;
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; box-sizing: border-box; background-color: #F5F6F8; }
.page__header { padding: 16rpx 0 24rpx; }
.page__title { display: block; font-size: 40rpx; font-weight: 700; color: #333333; }
.page__subtitle { display: block; font-size: 24rpx; color: #999999; margin-top: 8rpx; }
.page__body { padding-top: 80rpx; }
</style>
