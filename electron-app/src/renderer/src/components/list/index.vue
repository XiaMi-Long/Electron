<script setup></script>

<template>
  <div class="card-container">
    <div class="card" v-for="item of 10" :key="item"></div>
  </div>
</template>

<style scoped lang="scss">
.card-container {
  display: flex;
  flex-wrap: wrap;

  padding: 20px;
  .card {
    width: 20%;
    height: 300px;

    padding: 10px;
  }
}
</style>
