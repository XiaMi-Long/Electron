<script setup></script>

<template>
  <div class="video-container">
    <n-grid x-gap="12" :cols="4">
      <n-gi>
        <div class="card">
          <n-image width="100%" height="200" src="/src/assets/1.png" />
        </div>
      </n-gi>
    </n-grid>
    <!-- <div class="card">
      <n-image width="100%" height="200" src="/src/assets/1.png" />
    </div>

    <div class="card">
      <n-image width="100%" height="200" src="/src/assets/2.jpg" />
    </div>

    <div class="card">
      <n-image width="100%" height="200" src="/src/assets/2.jpg" />
    </div> -->
    <!-- 
    <div class="card">
      <n-image width="100%" height="200" src="/src/assets/2.jpg" />
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.video-container {
  display: flex;
  padding: 20px;
  height: 100%;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: space-around;

  .card {
    width: 100%;
    height: 200px;

    background-color: white;

    // margin-right: 20px;

    :deep(.n-image) {
      width: 100%;

      img {
        width: 100%;
      }
    }
  }
}
</style>
