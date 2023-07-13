<script setup>
import { ref, onMounted } from 'vue'
import { useNotification } from 'naive-ui'

const notification = useNotification()
const showLoading = ref(false)
const menuList = ref([
  {
    menuId: 'add',
    text: '+',
    icon: undefined,
    menuName: '添加图片'
  }
])
const imageList = ref([])

/**
 * 菜单点击的回调
 * @param {string} menuId 菜单唯一id
 */
const menuClick = async function (menuId) {
  switch (menuId) {
    case 'add':
      showLoading.value = true
      const { errLogs, result } = await window.api.background.handleBackgroundAddImage()
      if (errLogs.length > 0) {
        errLogs.forEach((item) => {
          notification.error({
            content: '上传文件出现错误',
            meta: item
          })
        })
      }
      rendererImage(result)

      window.api.synchronizeLocalAppConfigFile('背景切换目录添加图片之后')
      showLoading.value = false
      break

    default:
      window.api.logs.writeLog('背景切换目录下的添加图片出现未知错误', 'error')
      break
  }
}

/**
 * 页面初始化的时候,读取配置文件里面的图片
 */
const initRendererImage = async function () {
  const { result } = await window.api.background.initRendererImage()
  rendererImage(result)
}

/**
 * 渲染图片的公共方法
 * @param {*} data 数据源
 */
const rendererImage = function (data) {
  // 渲染图片
  data.forEach(({ buff, img }) => {
    const blob = new Blob([buff], { type: 'image/jpeg' })
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => {
        imageList.value.push({ url: reader.result, img })
      },
      false
    )
    reader.readAsDataURL(blob)
  })
}

onMounted(() => {
  initRendererImage()
})
</script>

<script>
export default {
  name: 'Background'
}
</script>

<template>
  <n-spin :show="showLoading" class="loading-container">
    <div class="video-container">
      <div class="image-container">
        <n-grid x-gap="12" :y-gap="8" cols="4 xs:1 s:2 m:3 l:4" responsive="screen">
          <n-gi v-for="(item, index) of imageList" :key="index">
            <div class="card">
              <n-image width="100%" height="200" :src="item.url" />
              <div class="overlay">123123</div>
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
  </n-spin>
</template>

<style scoped lang="scss">
.loading-container {
  height: 100%;

  :deep(.n-spin-content) {
    height: 100%;
  }
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

      position: relative;

      overflow: hidden;

      :deep(.n-image) {
        width: 100%;

        img {
          transition: all 0.5s;
          width: 100%;
        }

        img:hover {
          filter: brightness(115%);
        }
      }

      .overlay {
        position: absolute;
        top: 0;
        right: -20%; /* 初始化隐藏 */
        width: 20%;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        transition: right 0.3s ease;
      }

      &:hover .overlay {
        right: 0%;
      }
    }
  }
}
</style>
