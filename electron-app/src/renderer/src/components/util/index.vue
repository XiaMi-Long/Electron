<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const pageList = ref([
  {
    pageName: '背景切换',
    pageDescribe: '可以实现桌面背景的切换',
    pageUrl: '/background'
  },
  {
    pageName: '短信提醒',
    pageDescribe: '可以实现短信提醒功能来进行提示',
    pageUrl: '/textMessageReminder'
  }
])

/**
 * 跳转页面
 * @param {*} enumList 被选中菜单列表
 */
const goPage = function (url) {
  router.push(url)
}
</script>

<script>
export default {
  name: 'Util'
}
</script>

<template>
  <div class="util-container">
    <div class="flex-box">
      <n-grid x-gap="12" :y-gap="8" cols="4 xs:1 s:2 m:3 l:4" responsive="screen">
        <n-gi v-for="(item, index) of pageList" :key="index">
          <n-card :title="item.pageName" hoverable class="page-box" @click="goPage(item.pageUrl)">
            {{ item.pageDescribe }}
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<style scoped lang="scss">
.util-container {
  display: flex;
  padding: 50px;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;

  background-color: white;

  .flex-box {
    .page-box {
      cursor: pointer;
    }
  }
}
</style>
