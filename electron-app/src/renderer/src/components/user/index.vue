<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@renderer/paina/user'

const store = useUserStore()
const message = useMessage()

const showLoading = ref(false)

const uploadLocalFile = async function () {
  const { url, originUrl } = await window.api.user.selectFile()
  showLoading.value = true
  store.setUserAvatarBase64(url)
  // 通知主进程copy图片
  const result = window.api.user.updateLocalAvatarFile(originUrl)
  if (result) {
    message.success('图片上传成功')
    showLoading.value = false
    return
  }

  showLoading.value = false
  message.error('图片上传失败')
}
</script>

<template>
  <div class="user-container">
    <n-spin :show="showLoading">
      <n-list bordered>
        <n-list-item>
          <n-avatar class="avatar animate__animated" :size="200" :src="store.userAvatarBase64" />
          <template #suffix>
            <n-button type="primary" @click="uploadLocalFile"> 上传本地图片 </n-button>
          </template>
        </n-list-item>
      </n-list>
    </n-spin>
  </div>
</template>

<style scoped lang="scss">
.user-container {
  display: flex;
  padding: 50px;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;

  .avatar {
    transition: all 2s;
    &:hover {
      animation: flip; /* referring directly to the animation's @keyframe declaration */
      animation-duration: 2s; /* don't forget to set a duration! */
    }
  }
}
</style>
