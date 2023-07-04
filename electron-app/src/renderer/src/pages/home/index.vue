<script setup>
import BaseList from '@renderer/components/list/index.vue'
</script>

<template>
  <div class="container">
    <div class="list-container">
      <BaseList />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 100vh;
  .list-container {
    height: 90%;
    overflow: auto;
  }
}
</style>
