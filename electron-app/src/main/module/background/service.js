import { shuffle } from 'lodash'
import { appConfig } from '../../config/app-config'

const setTimeout = null

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
 * 开启壁纸切换
 * 1. 根据参数来算出几分钟切换一次,是按什么规则进行切换
 * @param {*} event
 * @param {*} form 用户填写的表单值
 */
export const handleStart = function (event, form) {
  console.log(form)
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

  setTimeout = setTimeout(() => {}, milliseconds)

  console.log(imagePaths)
  console.log(milliseconds)
}
