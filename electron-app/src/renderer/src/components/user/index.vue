<script setup>
const uploadLocalFile = async function () {
  const res = await window.api.selectFile()
  console.log(res)
}
</script>

<template>
  <div class="user-container">
    <n-list bordered>
      <n-list-item>
        <n-avatar
          class="avatar animate__animated"
          round
          :size="150"
          src="/src/assets/image/laopo.jpg"
        />
        <template #suffix>
          <n-button type="primary" @click="uploadLocalFile"> 上传本地图片 </n-button>
        </template>
      </n-list-item>
    </n-list>
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
