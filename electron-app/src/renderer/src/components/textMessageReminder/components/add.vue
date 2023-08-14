<script setup>
import dayjs from 'dayjs'
import { useMessage } from 'naive-ui'
import { ref, computed, watch } from 'vue'
import { generateUUID } from '@renderer/util/uuid'
import { TimerOutlined } from '@vicons/material'
import { useTextMessageStore } from '@renderer/paina/text-message'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})
const message = useMessage()
const emit = defineEmits(['close'])
const textMessage = useTextMessageStore()

const form = ref({
  uuid: '',
  title: '我推的孩子',
  content: `《我推的孩子》（日语：推しの子）是由赤坂明原作、横枪萌果作画的一部漫画，于集英社《週刊YOUNG JUMP》2020年第21期开始连载1。截至2作；第1集时长为90分钟，并`,
  label: [],
  labelType: 'info',
  importanceLevel: 2,
  phone: '17115664133',
  time: '',
  timeType: '',
  week: '',
  isStart: false,
  cron: ''
})

const labelTypeOptions = [
  {
    label: '绿色',
    value: 'success'
  },
  {
    label: '黄色',
    value: 'warning'
  },
  {
    label: '红色',
    value: 'error'
  },
  {
    label: '蓝色',
    value: 'info'
  }
]
const importanceLevelOptions = [
  {
    label: '重要',
    value: 1
  },
  {
    label: '一般',
    value: 2
  }
]
const timeTypeOptions = [
  {
    label: '每天',
    value: 1
  },
  {
    label: '今天',
    value: 2
  },
  {
    label: '每星期固定时间',
    value: 3
  }
]
const weekOptions = [
  {
    label: '一',
    value: 1
  },
  {
    label: '二',
    value: 2
  },
  {
    label: '三',
    value: 3
  },
  {
    label: '四',
    value: 4
  },
  {
    label: '五',
    value: 5
  },
  {
    label: '六',
    value: 6
  },
  {
    label: '日',
    value: 7
  }
]
const rules = {
  title: {
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入标题'
  },
  content: {
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入内容'
  },
  phone: {
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入手机号'
  },
  time: {
    type: 'number',
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入提醒时间'
  },
  week: {
    type: 'number',
    required: true,
    trigger: ['input', 'blur'],
    message: '请选择星期几'
  },
  timeType: {
    type: 'number',
    required: true,
    trigger: ['input', 'blur'],
    message: '请选择提醒类型'
  }
}

const formRef = ref(null)
const previewCardTopRightColor = ref('#33abff')

/**
 * 处理提醒时间处理回调
 * @param {number | null} value
 */
const handleTimePickerConfirm = function (value) {
  form.value.time = value
}

/**
 * 提交添加提醒表单
 */
const add = function (e) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      form.value.uuid = generateUUID()
      const bool = textMessage.setMessageList(form.value)
      if (bool) {
        message.success('添加提醒成功')
      }

      if (!bool) {
        message.error('添加提醒失败')
      }
      emit('close')
    } else {
      message.error('表单填写错误')
    }
  })
}

/**
 * 关闭添加提醒弹窗
 */
const cancel = function () {
  emit('close')
}

/**
 * 控制弹窗开关
 */
const showModal = computed({
  get() {
    return props.show
  },
  set() {
    emit('close')
  }
})

// 监听重要程度,不同程度不同颜色
watch(
  () => form.value.importanceLevel,
  (newVal) => {
    if (newVal === 1) {
      previewCardTopRightColor.value = '#ff6268'
    }

    if (newVal === 2) {
      previewCardTopRightColor.value = '#33abff'
    }
  }
)
</script>

<template>
  <div>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="添加提醒"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="medium"
          :style="{
            maxWidth: '640px'
          }"
        >
          <n-form-item label="标题" path="title">
            <n-input v-model:value="form.title" placeholder="请输入标题" />
          </n-form-item>

          <n-form-item label="内容" path="content">
            <n-input
              v-model:value="form.content"
              placeholder="请输入内容"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
              show-count
              maxlength="100"
            />
          </n-form-item>

          <n-form-item label="手机号" path="phone">
            <n-input v-model:value="form.phone" placeholder="请输入手机号" />
          </n-form-item>

          <n-form-item label="提醒时间-星期" path="week" v-if="form.timeType === 3">
            <n-select v-model:value="form.week" :options="weekOptions" />
          </n-form-item>

          <n-form-item label="提醒时间" path="time">
            <n-time-picker @confirm="handleTimePickerConfirm" />
          </n-form-item>

          <n-form-item label="提醒类型" path="timeType">
            <n-select v-model:value="form.timeType" :options="timeTypeOptions" />
          </n-form-item>

          <n-form-item label="标签" path="">
            <n-dynamic-tags v-model:value="form.label" />
          </n-form-item>

          <n-form-item label="标签类型" path="">
            <n-select v-model:value="form.labelType" :options="labelTypeOptions" />
          </n-form-item>

          <n-form-item label="重要程度" path="">
            <n-select v-model:value="form.importanceLevel" :options="importanceLevelOptions" />
          </n-form-item>
        </n-form>

        <n-divider />

        <n-card
          title="效果预览"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          class="priview-card"
        >
          <n-grid x-gap="12" :y-gap="8" cols="1" responsive="screen">
            <n-gi>
              <n-card hoverable class="priview-message-box">
                <!-- 右上角背景颜色 -->
                <div
                  class="priview-top-right-back"
                  :style="{ 'border-top-color': previewCardTopRightColor }"
                />

                <template #header>
                  <n-popover trigger="hover" width="trigger">
                    <template #trigger>
                      <span class="n-ellipsis n-ellipsis-1">
                        {{ form.title }}
                      </span>
                    </template>
                    <span>{{ form.title }}</span>
                  </n-popover>
                </template>

                <div class="priview-tag-content">
                  <!-- tag区域 -->
                  <n-space>
                    <n-tag
                      size="small"
                      :type="form.labelType"
                      v-for="(item, index) of form.label"
                      :key="index"
                    >
                      {{ item }}
                    </n-tag>
                  </n-space>
                </div>

                <!-- 内容区域 -->
                <div class="priview-text">
                  <n-popover trigger="hover" width="trigger">
                    <template #trigger>
                      <span class="n-ellipsis n-ellipsis-2">
                        {{ form.content }}
                      </span>
                    </template>
                    <span>{{ form.content }}</span>
                  </n-popover>
                </div>

                <!-- 提醒时间 -->
                <div class="priview-time-text">
                  <n-icon size="15">
                    <TimerOutlined />
                  </n-icon>
                  <div>
                    <span v-if="form.timeType === 1 && form.time">
                      每天{{ dayjs(form.time).format('HH:mm:ss') }}时提醒
                    </span>
                    <span v-if="form.timeType === 2 && form.time">
                      今天{{ dayjs(form.time).format('HH:mm:ss') }}时提醒
                    </span>
                    <span v-if="form.timeType === 3 && form.time">
                      每星期{{ form.week }}-{{ dayjs(form.time).format('HH:mm:ss') }}时提醒
                    </span>
                  </div>
                </div>
              </n-card>
            </n-gi>
          </n-grid>
        </n-card>

        <template #footer>
          <n-space justify="end">
            <n-button type="success" @click="add"> 提交 </n-button>
            <n-button @click="cancel"> 取消 </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
.priview-card {
  :deep(.n-card-header) {
    padding-bottom: 0px;
  }

  .priview-tag-content {
    margin: 5px 0;
  }
  .priview-message-box {
    // height: 170px;

    overflow: auto;

    .priview-top-right-back {
      position: absolute;
      top: 0;
      right: 0;
      border-top-width: 20px;
      border-top-style: solid;
      border-left: 20px solid transparent;
    }
  }

  .priview-text {
    font-size: 13px;

    color: #777;

    line-height: 2;
  }

  .priview-time-text {
    display: flex;
    align-items: center;
    justify-content: end;

    color: #777;

    font-size: 12px;
  }
}
</style>
