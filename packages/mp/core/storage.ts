/**
 * 本地存储封装 - token/用户信息缓存
 */
const TOKEN_KEY = 'semo_token';
const USER_KEY = 'semo_user';

export const storage = {
  getToken(): string | null {
    return uni.getStorageSync(TOKEN_KEY) || null;
  },
  setToken(token: string): void {
    uni.setStorageSync(TOKEN_KEY, token);
  },
  removeToken(): void {
    uni.removeStorageSync(TOKEN_KEY);
  },
  getUser<T>(): T | null {
    const raw = uni.getStorageSync(USER_KEY);
    return raw ? (raw as T) : null;
  },
  setUser<T>(user: T): void {
    uni.setStorageSync(USER_KEY, user);
  },
  removeUser(): void {
    uni.removeStorageSync(USER_KEY);
  },
  clear(): void {
    this.removeToken();
    this.removeUser();
  },
};
