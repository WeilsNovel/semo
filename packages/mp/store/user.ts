/**
 * 用户状态 - Pinia
 * 约束：token/user 持久化经 core/storage，tokenGetter 注入 core/request
 *       禁止在组件内直接读 storage，统一经此 store
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { storage } from '@/core/storage';
import { setTokenGetter } from '@/core/request';
import { setUploadTokenGetter } from '@/api/upload';
import { getUserProfile } from '@/api/user';
import type { UserItem } from '@semo/shared';

/** 初始化时立即把 storage 的 tokenGetter 注入 request 与 upload（仅执行一次） */
setTokenGetter(() => storage.getToken());
setUploadTokenGetter(() => storage.getToken());

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref<string | null>(storage.getToken());
  const user = ref<UserItem | null>(storage.getUser<UserItem>());

  // getters
  const isLoggedIn = computed<boolean>(() => !!token.value);
  const nickname = computed<string>(() => user.value?.nickname ?? '');

  // actions
  function setToken(newToken: string): void {
    token.value = newToken;
    storage.setToken(newToken);
  }

  function setUser(newUser: UserItem): void {
    user.value = newUser;
    storage.setUser(newUser);
  }

  async function fetchUserProfile(): Promise<UserItem> {
    const profile = await getUserProfile();
    setUser(profile);
    return profile;
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    storage.clear();
  }

  return {
    token,
    user,
    isLoggedIn,
    nickname,
    setToken,
    setUser,
    fetchUserProfile,
    logout,
  };
});
