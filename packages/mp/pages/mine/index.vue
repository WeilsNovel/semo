<template>
  <view class="page page--mine">
    <view class="page__header">
      <text class="page__title">{{ pageTitle }}</text>
    </view>

    <view class="page__body">
      <UserProfileCard v-if="profile" :params="profileCardParams" />

      <BaseCard :params="{ title: editTitle }">
        <view class="mine__form">
          <view class="mine__form-row">
            <text class="mine__form-label">{{ nicknameLabel }}</text>
            <input class="mine__form-input" v-model="editForm.nickname" :placeholder="nicknamePlaceholder" />
          </view>
          <view class="mine__form-row">
            <text class="mine__form-label">{{ ageLabel }}</text>
            <input class="mine__form-input" type="number" v-model="editForm.age" :placeholder="agePlaceholder" />
          </view>
          <view class="mine__form-row">
            <text class="mine__form-label">{{ heightLabel }}</text>
            <input class="mine__form-input" type="number" v-model="editForm.height" :placeholder="heightPlaceholder" />
          </view>
          <view class="mine__form-row">
            <text class="mine__form-label">{{ weightLabel }}</text>
            <input class="mine__form-input" type="number" v-model="editForm.weight" :placeholder="weightPlaceholder" />
          </view>
          <view class="mine__form-row">
            <text class="mine__form-label">{{ targetCaloriesLabel }}</text>
            <input class="mine__form-input" type="number" v-model="editForm.targetCalories" :placeholder="targetCaloriesPlaceholder" />
          </view>

          <BaseButton
            :params="{ text: saveButtonText, type: 'primary', block: true, loading: saving, disabled: saving }"
            @click="handleSave"
          />
        </view>
      </BaseCard>

      <BaseButton :params="{ text: logoutText, type: 'danger', block: true }" @click="handleLogout" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 我的页 - 用户档案展示 + 编辑，全 mock
 */
import { ref, computed, onMounted, reactive } from 'vue';
import { UserProfileCard, BaseCard, BaseButton } from '@/components';
import { useUserStore } from '@/store/user';
import { updateUserProfile } from '@/api/user';
import type { UserItem } from '@semo/shared';
import { DEFAULT_TEXT_CONFIG } from '@/config';
import type { UserProfileCardParams } from '@/types/component';

const userStore = useUserStore();

const pageTitle = '我的';
const editTitle = '编辑档案';
const nicknameLabel = '昵称';
const ageLabel = '年龄';
const heightLabel = '身高(cm)';
const weightLabel = '体重(kg)';
const targetCaloriesLabel = '目标热量';
const nicknamePlaceholder = '请输入昵称';
const agePlaceholder = '请输入年龄';
const heightPlaceholder = '请输入身高';
const weightPlaceholder = '请输入体重';
const targetCaloriesPlaceholder = '请输入目标热量';
const saveButtonText = DEFAULT_TEXT_CONFIG.save;
const logoutText = '退出登录';

const profile = ref<UserItem | null>(null);
const saving = ref<boolean>(false);

const editForm = reactive<{
  nickname: string;
  age: string;
  height: string;
  weight: string;
  targetCalories: string;
}>({
  nickname: '',
  age: '',
  height: '',
  weight: '',
  targetCalories: '',
});

const profileCardParams = computed<UserProfileCardParams>(() => {
  const u = profile.value;
  if (!u) {
    return {
      nickname: DEFAULT_TEXT_CONFIG.appName,
      avatar: '',
      genderText: '未知',
      ageText: '-',
      heightWeightText: '-',
      targetCaloriesText: '-',
    };
  }
  const genderText = u.gender === 1 ? '男' : u.gender === 2 ? '女' : '未知';
  return {
    nickname: u.nickname,
    avatar: u.avatar ?? '',
    genderText,
    ageText: u.age != null ? `${u.age}岁` : '-',
    heightWeightText: u.height != null && u.weight != null ? `${u.height}cm / ${u.weight}kg` : '-',
    targetCaloriesText: u.targetCalories != null ? `目标 ${u.targetCalories}kcal` : '-',
  };
});

async function loadProfile(): Promise<void> {
  try {
    profile.value = await userStore.fetchUserProfile();
    syncEditForm();
  } catch (err) {
    void err;
  }
}

function syncEditForm(): void {
  const u = profile.value;
  if (!u) return;
  editForm.nickname = u.nickname;
  editForm.age = u.age != null ? String(u.age) : '';
  editForm.height = u.height != null ? String(u.height) : '';
  editForm.weight = u.weight != null ? String(u.weight) : '';
  editForm.targetCalories = u.targetCalories != null ? String(u.targetCalories) : '';
}

async function handleSave(): Promise<void> {
  saving.value = true;
  try {
    const updated = await updateUserProfile({
      nickname: editForm.nickname || undefined,
      age: editForm.age ? Number(editForm.age) : undefined,
      height: editForm.height ? Number(editForm.height) : undefined,
      weight: editForm.weight ? Number(editForm.weight) : undefined,
      targetCalories: editForm.targetCalories ? Number(editForm.targetCalories) : undefined,
    });
    profile.value = updated;
    userStore.setUser(updated);
    syncEditForm();
    uni.showToast({ title: '保存成功', icon: 'success' });
  } catch (err) {
    void err;
  } finally {
    saving.value = false;
  }
}

function handleLogout(): void {
  userStore.logout();
  uni.showToast({ title: '已退出', icon: 'none' });
}

onMounted(() => {
  void loadProfile();
});
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; box-sizing: border-box; background-color: #F5F6F8; }
.page__header { padding: 16rpx 0 24rpx; }
.page__title { display: block; font-size: 40rpx; font-weight: 700; color: #333333; }
.page__body { display: flex; flex-direction: column; gap: 24rpx; }
.mine__form { display: flex; flex-direction: column; gap: 24rpx; }
.mine__form-row { display: flex; align-items: center; gap: 16rpx; }
.mine__form-label { width: 160rpx; font-size: 26rpx; color: #666666; }
.mine__form-input { flex: 1; padding: 12rpx 16rpx; border: 1rpx solid #EEEEEE; border-radius: 8rpx; font-size: 26rpx; color: #333333; }
</style>
