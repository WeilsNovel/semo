<template>
  <view class="user-profile-card">
    <view class="user-profile-card__avatar">
      <image v-if="params.avatar" class="user-profile-card__avatar-img" :src="params.avatar" mode="aspectFill" />
      <text v-else class="user-profile-card__avatar-placeholder">{{ avatarPlaceholder }}</text>
    </view>
    <view class="user-profile-card__info">
      <text class="user-profile-card__nickname">{{ params.nickname }}</text>
      <text class="user-profile-card__row">{{ params.genderText }} · {{ params.ageText }}</text>
      <text class="user-profile-card__row">{{ params.heightWeightText }}</text>
      <text class="user-profile-card__row">{{ params.targetCaloriesText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 用户档案卡片 - 挂载 params 对象渲染
 */
import { computed } from 'vue';
import { DEFAULT_USER_PROFILE_PARAMS, type UserProfileCardParams } from '@/types/component';
import { DEFAULT_TEXT_CONFIG } from '@/config';

const props = withDefaults(defineProps<{
  params?: Partial<UserProfileCardParams>;
}>(), {
  params: () => ({}),
});

const merged = computed<UserProfileCardParams>(() => ({ ...DEFAULT_USER_PROFILE_PARAMS, ...props.params }));

const avatarPlaceholder = computed(() => merged.value.nickname.charAt(0) || DEFAULT_TEXT_CONFIG.appName.charAt(0));
</script>

<style scoped>
.user-profile-card { display: flex; align-items: center; padding: 32rpx; background-color: #FFFFFF; border-radius: 16rpx; }
.user-profile-card__avatar { width: 120rpx; height: 120rpx; border-radius: 60rpx; background-color: #4CAF50; display: flex; align-items: center; justify-content: center; margin-right: 32rpx; }
.user-profile-card__avatar-img { width: 120rpx; height: 120rpx; border-radius: 60rpx; }
.user-profile-card__avatar-placeholder { color: #FFFFFF; font-size: 48rpx; font-weight: 700; }
.user-profile-card__info { flex: 1; display: flex; flex-direction: column; gap: 8rpx; }
.user-profile-card__nickname { font-size: 34rpx; font-weight: 600; color: #333333; }
.user-profile-card__row { font-size: 24rpx; color: #666666; }
</style>
