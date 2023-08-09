<script setup>
import { ref } from 'vue'
import goBack from '@renderer/components/go-back/index.vue'

const showLoading = ref(false)
</script>

<template>
  <div class="box">
    <n-spin :show="showLoading" class="loading-container">
      <n-scrollbar>
        <div class="message-container">
          <goBack />
          <!-- 顶部区域 -->
          <div class="topArea"></div>

          <!-- 内容区域 -->
          <div class="contentArea"></div>
        </div>
      </n-scrollbar>
    </n-spin>
  </div>
</template>

<style scoped lang="scss">
.box {
  height: 100%;

  background-color: #fff;

  box-sizing: border-box;

  .loading-container {
    height: 100%;

    :deep(.n-spin-content) {
      height: 100%;
    }

    .message-container {
      height: 100%;
      padding: 20px;

      box-sizing: border-box;

      overflow: auto;
      .topArea {
        height: 40%;

        border: 1px solid black;
      }

      .contentArea {
        height: 60%;
      }
    }
  }
}
</style>
