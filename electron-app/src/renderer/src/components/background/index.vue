<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useNotification } from 'naive-ui'
import { ErrorFilled } from '@vicons/material'
import goBack from '@renderer/components/go-back/index.vue'

const message = useMessage()

const notification = useNotification()
const form = ref({
  updateTime: '',
  updateRules: '1'
})
const updateRules = [
  {
    value: '1',
    label: '顺序切换'
  },
  {
    value: '2',
    label: '随机切换'
  }
]
const rules = {
  updateTime: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请输入')
      }

      if (!/^\d+(\.\d)?$/.test(value)) {
        return new Error('请输入整数,小数点后最多一位')
      }

      return true
    },
    trigger: ['input', 'blur']
  }
}
const formRef = ref(null)
const drawer = ref(false)
const imageList = ref([])
const showLoading = ref(false)

/**
 * 设置图标点击的回调
 */
const settingClick = async function () {
  drawer.value = true
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
        imageList.value.push({ url: reader.result, img, load: false })
      },
      false
    )
    reader.readAsDataURL(blob)
  })
}

/**
 * 每个图片加载完成的回调
 */
const imageLoad = function (index) {
  setTimeout(() => {
    if (!imageList.value[index]) {
      return
    }

    imageList.value[index].load = true
  }, 2000)
}

/**
 * 上传图片
 */
const upload = async function () {
  showLoading.value = true
  const { errLogs, result, empty } = await window.api.background.handleBackgroundAddImage()
  if (empty) {
    showLoading.value = false
    return
  }

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
}

/**
 * 删除图片
 */
const deleteImage = async function (imgItem) {
  showLoading.value = true
  const result = await window.api.background.handleDeleteImage(imgItem.img.path)
  if (result) {
    const index = imageList.value.findIndex((item) => item.img.fileId === imgItem.img.fileId)
    if (index === -1) {
      window.logs.writeLog('获取要删除的图片下标,没有找到', 'error')
      message.error('删除图片失败,出现未知错误')
      return
    }
    imageList.value.splice(index, 1)
    message.error('删除图片成功')
  }

  if (!result) {
    message.error('删除图片失败,请检查是否拥有删除的权限或是否有此图片')
  }

  showLoading.value = false
}

/**
 * 开始切换按钮回调
 * @param {Event} e 事件对象
 */
const handleValidateClick = function (e) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { background } = await window.api.get.getAppConfig()
      if (background.imageList.length === 0) {
        message.error('请上传至少一张图片')
        return
      }
      window.api.common.synchronizeLocalAppConfigByRead()
      window.api.background.handleStart({ ...form.value })
      message.success('启动成功')
    } else {
      message.error('表单填写错误')
    }
  })
}

/**
 * 取消背景切换
 */
const cancel = function () {
  window.api.background.handleStop({ ...form.value })
  message.success('取消成功')
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
  <div class="box">
    <n-spin :show="showLoading" class="loading-container">
      <n-scrollbar>
        <div class="video-container">
          <goBack />

          <div class="image-container">
            <n-grid x-gap="12" :y-gap="8" cols="4 xs:1 s:2 m:3 l:4" responsive="screen">
              <n-gi v-for="(item, index) of imageList" :key="index">
                <div class="card">
                  <!-- 加载未完成之前展示骨架屏 -->
                  <n-skeleton
                    v-if="item.load === false"
                    class="skeleton"
                    height="200px"
                    width="100%"
                  />

                  <n-image width="100%" height="200" :src="item.url" :on-load="imageLoad(index)" />
                  <div class="overlay" @click="deleteImage(item)" v-show="item.load">
                    <img src="/src/assets/img/delete.png" alt="" width="48" height="48" />
                  </div>
                </div>
              </n-gi>
            </n-grid>
          </div>

          <div class="menu-container">
            <div class="setting">
              <img
                @click="settingClick"
                class="setting-icon"
                src="/src/assets/img/setting.png"
                alt=""
                width="40"
                height="40"
              />
            </div>
          </div>
        </div>
      </n-scrollbar>

      <n-drawer
        v-model:show="drawer"
        :width="500"
        :height="200"
        placement="right"
        :trap-focus="false"
        :block-scroll="false"
      >
        <n-drawer-content title="页面设置">
          <n-form ref="formRef" :model="form" :rules="rules">
            <n-form-item label="更新间隔（分钟）" path="updateTime">
              <n-input v-model:value="form.updateTime" placeholder="单位:分钟" />
            </n-form-item>

            <n-form-item label="更新规格">
              <n-radio-group v-model:value="form.updateRules">
                <n-space>
                  <n-radio v-for="item in updateRules" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-form>

          <n-space vertical>
            <n-space>
              <n-button type="info" @click="handleValidateClick"> 开始 </n-button>
              <n-button type="error" @click="cancel"> 取消 </n-button>
              <n-button type="success" @click="upload"> 上传图片 </n-button>
            </n-space>

            <n-space>
              <div class="tip-text">
                <n-icon size="15">
                  <ErrorFilled />
                </n-icon>
                <span> 删除图片会取消图片切换 </span>
              </div>
            </n-space>
          </n-space>
        </n-drawer-content>
      </n-drawer>
    </n-spin>
  </div>
</template>

<style scoped lang="scss">
.box {
  background-color: #fff;

  height: 100%;
}
.loading-container {
  height: 100%;

  :deep(.n-spin-content) {
    height: 100%;
  }
  .video-container {
    padding: 20px;
    height: 100%;
    box-sizing: border-box;

    background-color: white;

    overflow: auto;

    .image-container {
      height: 100%;
    }

    .menu-container {
      position: fixed;
      right: 1%;
      bottom: 50%;

      display: flex;
      align-items: center;
      justify-content: center;

      .setting {
        cursor: pointer;

        .setting-icon {
          transition: all 1s;
          &:hover {
            transform: scale(1.2) rotate(0.5turn);
          }
        }
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
        cursor: pointer;

        position: absolute;

        top: 0;
        right: -20%; /* 初始化隐藏 */

        width: 20%;
        height: 100%;

        background-color: white;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: right 0.3s ease;
      }

      &:hover .overlay {
        right: 0%;
      }
    }
  }
}

.tip-text {
  display: flex;
  align-items: center;

  color: #777;

  font-size: 12px;
}
</style>
