<template>
  <view class="app-root">
    <router-view />
  </view>
</template>

<script setup lang="ts">
/**
 * 应用根组件
 * 约束：仅放全局初始化，不放业务逻辑
 * TODO(MVP 后): 接入 @dcloudio/uni-app 的 onLaunch 钩子恢复登录态 / 全局错误监听
 */
</script>

<style>
/* 全局样式 - 仅放真正全局的 reset */
page { background-color: #F5F6F8; }
</style>
