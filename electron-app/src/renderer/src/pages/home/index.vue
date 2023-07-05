<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { enumConfig } from '@renderer/config/menu'
import { appConfig } from '@renderer/config/app'

const router = useRouter()
const selectedEnumId = ref('')

/**
 * 寻找默认被选中的菜单
 */
const findDefaultSelectEnum = function () {
  const defaultSelectEnum = enumConfig.find((item) => item.isDefaultSelected)
  router.push(defaultSelectEnum.menuNameUrl)
  selectedEnumId.value = defaultSelectEnum.id
}

/**
 * 跳转页面
 * @param {*} enumList 被选中菜单列表
 */
const goPage = function (enumList) {
  selectedEnumId.value = enumList.id
  router.push(enumList.menuNameUrl)
}

onMounted(() => {
  findDefaultSelectEnum()
})
</script>

<template>
  <div class="container">
    <div class="menu animate__animated animate__fadeInLeft">
      <div class="list-box">
        <div class="avatar list-item">
          <n-avatar round :size="70" src="/src/assets/image/laopo.jpg" />
        </div>
        <div
          v-for="(item, index) of enumConfig"
          :key="index"
          class="list-item"
          @click="goPage(item)"
        >
          <div class="box" :class="{ 'box-selected': item.id === selectedEnumId }">
            <span>{{ item.menuName }}</span>
          </div>
        </div>
      </div>

      <div class="version-box">
        <span>{{ appConfig.name }}</span>
        <span>{{ appConfig.appVersion }}</span>
      </div>
    </div>
    <div class="content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" enter-active-class="animate__animated animate__fadeInDown">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100vh;

  .menu {
    width: 200px;

    border: 1px solid black;

    // background-color: #06603b;
    background-color: #005276;

    .list-box {
      height: 90%;
      .list-item {
        padding: 10px;
        line-height: 1;
        cursor: pointer;
        text-align: center;

        color: white;

        .box {
          line-height: 2;
          &:hover {
            background-color: #ffffff1a;
            border-radius: 4px;
          }
        }

        .box-selected {
          background-color: #ffffff1a;
          border-radius: 4px;
        }
      }
    }

    .version-box {
      text-align: center;

      height: 10%;

      color: white;

      span {
        display: block;
      }
    }
  }

  .content {
    width: calc(100% - 200px);
    height: 100%;
  }
}
</style>
