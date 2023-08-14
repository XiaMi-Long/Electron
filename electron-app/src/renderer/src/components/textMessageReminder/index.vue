<script setup>
import dayjs from 'dayjs'
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import add from './components/add.vue'
import goBack from '@renderer/components/go-back/index.vue'
import { useTextMessageStore } from '@renderer/paina/text-message'

const message = useMessage()
const showModal = ref(false)
const showLoading = ref(false)
const textMessage = useTextMessageStore()

/**
 * 打开添加提醒弹窗
 */
const openAddModal = function () {
  showModal.value = true
}

/**
 * 关闭添加提醒弹窗
 */
const closeModal = function () {
  showModal.value = false
}

/**
 * 根据importanceLevel的值来决定返回什么颜色
 */
const getBorderColor = function (value) {
  if (value === 1) {
    return '#ff6268'
  }

  if (value === 2) {
    return '#33abff'
  }
}

/**
 * 运行提醒
 */
const start = async function (uuid) {
  showLoading.value = true
  const isBool = await window.api.textMessage.start(uuid)
  if (isBool) {
    message.success('运行成功')
  }

  if (!isBool) {
    message.error('运行失败')
  }

  showLoading.value = false
}

/**
 * 停止提醒
 */
const stop = function () {}

// 获取本地数据里面的提醒信息
onMounted(async () => {
  const config = await window.api.get.getAppConfig()
  textMessage.updateMessageList(config.textMessage)
})
</script>

<template>
  <div class="box">
    <n-spin :show="showLoading" class="loading-container">
      <n-scrollbar>
        <div class="message-container">
          <goBack />

          <div class="button-container">
            <n-button type="primary" @click="openAddModal"> 添加提醒 </n-button>
          </div>

          <!-- 内容区域 -->
          <div class="contentArea">
            <n-grid x-gap="12" :y-gap="8" cols="4 xs:1 s:2 m:3 l:4" responsive="screen">
              <n-gi v-for="(item, index) of textMessage.messageList" :key="index">
                <n-card hoverable class="message-box">
                  <!-- 右上角背景颜色 -->
                  <div
                    class="top-right-back"
                    :style="{ 'border-top-color': getBorderColor(item.importanceLevel) }"
                  />

                  <template #header>
                    <n-popover trigger="hover" width="trigger">
                      <template #trigger>
                        <span class="n-ellipsis n-ellipsis-1">
                          {{ item.title }}
                        </span>
                      </template>
                      <span>{{ item.title }}</span>
                    </n-popover>
                  </template>

                  <div class="tag-content">
                    <!-- tag区域 -->
                    <n-space>
                      <n-tag
                        size="small"
                        :type="item.labelType"
                        v-for="(labelItem, index) of item.label"
                        :key="index"
                      >
                        {{ labelItem }}
                      </n-tag>
                    </n-space>
                  </div>

                  <!-- 内容区域 -->
                  <div class="text">
                    <n-popover trigger="hover" width="trigger">
                      <template #trigger>
                        <span class="n-ellipsis n-ellipsis-2">
                          {{ item.content }}
                        </span>
                      </template>
                      <span>{{ item.content }}</span>
                    </n-popover>
                  </div>

                  <!-- 提醒时间 -->
                  <div class="time-text">
                    <div class="text">
                      <span v-if="item.isStart" @click="stop(item.uuid)">停止运行</span>
                      <span v-if="item.isStart"> 运行中 </span>

                      <span v-if="!item.isStart" @click="start(item.uuid)">运行</span>
                      <span v-if="!item.isStart"> 已停止 </span>
                    </div>

                    <div>
                      <span v-if="item.timeType === 1 && item.time">
                        每天{{ dayjs(item.time).format('HH:mm:ss') }}时提醒
                      </span>
                      <span v-if="item.timeType === 2 && item.time">
                        今天{{ dayjs(item.time).format('HH:mm:ss') }}时提醒
                      </span>
                      <span v-if="item.timeType === 3 && item.time">
                        <span v-if="item.timeType === 3 && item.time">
                          每星期{{ item.week }}-{{ dayjs(item.time).format('HH:mm:ss') }}时提醒
                        </span>
                      </span>
                    </div>
                  </div>
                </n-card>
              </n-gi>
            </n-grid>
          </div>
        </div>
      </n-scrollbar>
    </n-spin>

    <add :show="showModal" @close="closeModal" />
  </div>
</template>

<style scoped lang="scss">
.box {
  height: 100%;

  background-color: #fff;

  box-sizing: border-box;

  .loading-container {
    height: 100%;

    :deep(.n-spin-content) {
      height: 100%;
    }

    .message-container {
      padding: 20px;

      box-sizing: border-box;

      overflow: auto;
      .contentArea {
        min-height: 400px;

        .message-box {
          overflow: auto;

          :deep(.n-card-header) {
            padding-bottom: 0px;
          }

          .top-right-back {
            position: absolute;
            top: 0;
            right: 0;
            border-top-width: 20px;
            border-top-style: solid;
            border-left: 20px solid transparent;
          }

          .time-text {
            display: flex;
            align-items: center;
            justify-content: space-between;

            color: #777;

            font-size: 12px;

            .text {
              cursor: pointer;

              color: #ff6060;

              & span:nth-child(1) {
                color: #00d800;
              }
            }
          }
        }
      }
    }
  }

  .button-container {
    margin: 15px 0px;
  }
}

.text {
  font-size: 13px;

  color: #777;

  line-height: 2;
}
</style>
