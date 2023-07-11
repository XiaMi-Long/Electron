<script setup>
import { useUserStore } from '@renderer/paina/user'
const store = useUserStore()

const init = async function () {
  const { avatarBase64 = '' } = await window.api.initRenderer()
  // 设置头像默认值
  store.userAvatarBase64 = avatarBase64
}

init()
</script>

<template>
  <n-message-provider>
    <n-notification-provider>
      <div class="container">
        <router-view></router-view>
      </div>
    </n-notification-provider>
  </n-message-provider>
</template>

<style lang="less">
@import './assets/css/styles.scss';

body {
  background-color: #ecedef;

  box-sizing: content-box;
  // padding: 40px;
}
</style>
