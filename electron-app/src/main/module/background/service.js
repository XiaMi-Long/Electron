import { shuffle } from 'lodash'
import { appConfig } from '../../config/app-config'
import { generateUUID } from '../../common/uuid'
import { writeLog } from '../../common/log'

const wallpaper = require('wallpaper')

const service = {
  isStop: true,
  id: {
    obj: {},
    ids: []
  }
}

/**
 * 分钟转换为秒数再转换为毫秒数
 * @param {*} minutes 分钟
 * @returns
 */
function minutesToMilliseconds(minutes) {
  const seconds = minutes * 60
  const milliseconds = seconds * 1000
  return milliseconds
}

/**
 * 设置背景图片
 */
async function setBackground(url) {
  await wallpaper.set(url)
}

/**
 * 递归定时器更新背景图片
 */
function recursiveTime(dataArray, interval, key) {
  let index = 0

  function executeTask() {
    const { path } = dataArray[index]
    index = (index + 1) % dataArray.length // 更新索引，循环取值
    const timeoutId = setTimeout(executeTask, interval)

    if (service.id.obj[key] === false) {
      writeLog('背景切换定时器取消', 'success')
      clearTimeout(timeoutId)
    }
    setBackground(path)
  }

  setTimeout(executeTask, interval)
}

/**
 * 开启壁纸切换
 * 1. 根据参数来算出几分钟切换一次,是按什么规则进行切换
 * @param {*} event
 * @param {*} form 用户填写的表单值
 */
export const handleStart = function (event, form) {
  const milliseconds = minutesToMilliseconds(Number(form.updateTime))
  let imagePaths = []
  // 顺序切换
  if (form.updateRules === '1') {
    imagePaths = [...appConfig.background.imageList]
  }
  // 随机切换
  if (form.updateRules === '2') {
    imagePaths = shuffle(appConfig.background.imageList)
  }

  // 把上一次的定时器关闭
  if (service.id.ids.length !== 0) {
    const ids = service.id.ids.pop()
    service.id.obj[ids] = false
  }

  // 生成唯一id对象
  const key = generateUUID()
  service.id.obj[key] = true
  service.id.ids.push(key)
  recursiveTime(imagePaths, milliseconds, key)
  writeLog('背景切换定时器开启', 'success')
}

/**
 * 停止背景切换
 */
export const handleStop = function () {
  const ids = service.id.ids.pop()
  service.id.obj[ids] = false
}
