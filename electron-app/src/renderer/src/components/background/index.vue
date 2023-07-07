<script setup></script>

<template>
  <div class="video-container">
    <n-grid x-gap="12" :y-gap="8" cols="4 xs:1 s:2 m:3 l:4" responsive="screen">
      <n-gi>
        <div class="card">
          <n-image width="100%" height="200" src="/src/assets/1.png" />
        </div>
      </n-gi>

      <n-gi>
        <div class="card">
          <n-image width="100%" height="200" src="/src/assets/1.png" />
        </div>
      </n-gi>

      <n-gi>
        <div class="card">
          <n-image width="100%" height="200" src="/src/assets/1.png" />
        </div>
      </n-gi>

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
  padding: 20px;
  height: 100%;
  box-sizing: border-box;

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
