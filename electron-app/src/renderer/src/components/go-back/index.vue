<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbList = ref([
  {
    name: '工具集',
    url: '/util'
  },
  {
    name: route.meta.title,
    url: route.path
  }
])
</script>

<template>
  <div class="breadcrumb-box">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="(item, index) of breadcrumbList" :key="index">
        <router-link :to="item.url">{{ item.name }}</router-link>
      </n-breadcrumb-item>
    </n-breadcrumb>
  </div>
</template>

<style scoped lang="scss">
.breadcrumb-box {
  //   height: 60px;
}
</style>
