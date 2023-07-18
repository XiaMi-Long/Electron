import { shuffle } from 'lodash'
import { appConfig } from '../../config/app-config'
const wallpaper = require('wallpaper')

const service = {
  isFirst: true,
  isStop: false
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
function recursiveTime(dataArray, interval) {
  let index = 0

  function executeTask() {
    if (service.isStop) {
      return
    }

    const { path } = dataArray[index]
    index = (index + 1) % dataArray.length // 更新索引，循环取值
    setBackground(path)
    setTimeout(executeTask, interval)
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

  if (service.isFirst === false) {
    service.isStop = true
    service.isFirst = true
  }

  // 第一次启动
  if (service.isFirst === true) {
    service.isStop = false
    recursiveTime(imagePaths, milliseconds)
    service.isFirst = false
  }
}

/**
 * 停止背景切换
 */
export const handleStop = function () {
  service.isStop = true
}
