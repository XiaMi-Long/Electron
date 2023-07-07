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
  </div>
</template>

<style scoped lang="scss">
.video-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;

  overflow: auto;

  .card {
    width: 100%;
    height: 200px;

    background-color: white;

    // margin-right: 20px;

    :deep(.n-image) {
      width: 100%;

      img {
        transition: all 0.5s;
        width: 100%;
      }

      img:hover {
        filter: brightness(125%);
        transform: scale(1.05);
      }
    }
  }
}
</style>
