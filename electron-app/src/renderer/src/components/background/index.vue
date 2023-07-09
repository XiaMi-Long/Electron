<script setup>
import { ref } from 'vue'

const menuList = ref([
  {
    menuId: 'add',
    text: '+',
    icon: undefined,
    menuName: '添加图片'
  }
])

/**
 * 菜单点击的回调
 * @param {string} menuId 菜单唯一id
 */
const menuClick = function (menuId) {
  switch (menuId) {
    case 'add':
      window.api.synchronizeLocalAppConfigFile('背景切换目录添加图片之后')
      break

    default:
      window.api.logs.writeLog('背景切换目录下的添加图片出现未知错误', 'error')
      break
  }
}
</script>

<template>
  <div class="video-container">
    <div class="image-container">
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
    <div class="menu-container">
      <div
        class="menu-list"
        v-for="(item, index) of menuList"
        :key="index"
        @click="menuClick(item.menuId)"
      >
        <span v-if="item.icon === undefined">{{ item.text }}</span>
        <span v-if="item.icon">
          <span v-html="item.icon"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;

  overflow: auto;

  .image-container {
    height: 90%;
  }

  .menu-container {
    height: 10%;

    display: flex;
    align-items: center;
    justify-content: center;

    .menu-list {
      width: 5%;
      height: 80%;
      border-radius: 50%;

      cursor: pointer;

      font-size: 35px;

      color: white;

      background-color: #94ddf9;

      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

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
