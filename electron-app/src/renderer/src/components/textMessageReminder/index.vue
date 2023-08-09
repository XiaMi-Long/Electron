<script setup>
import goBack from '@renderer/components/go-back/index.vue'
</script>

<template>
  <div class="box">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <div class="message-container">
          <goBack />
          <!-- 顶部区域 -->
          <div class="topArea"></div>

          <!-- 内容区域 -->
          <div class="contentArea"></div>
        </div>
      </n-gi>
    </n-grid>
  </div>
</template>

<style scoped lang="scss">
.box {
  height: 100%;

  background-color: #fff;

  box-sizing: border-box;
}
.message-container {
  height: 100%;
  padding: 20px;
  .topArea {
    height: 40%;

    border: 1px solid black;
  }

  .contentArea {
    height: 60%;
  }
}
</style>
