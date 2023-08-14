import { appConfig } from '../../config/app-config'
import { handleSynchronizeLocalAppConfigFileByWrite } from '../../common'

export const jobs = []
const schedule = require('node-schedule')

/**
 * 添加消息提醒后
 * @param {*} event
 * @param {*} value
 */
export const handlePushTextMessage = async function (event, value) {
  return new Promise((resolve, reject) => {
    const jobValue = JSON.parse(value)
    try {
      appConfig.textMessage = jobValue
      handleSynchronizeLocalAppConfigFileByWrite(null, '在添加消息提醒后更新文件')
      resolve(true)
    } catch (error) {
      reject(false)
    }
  })
}

/**
 * 监听提醒开始
 * @param {*} event
 * @param {*} uuid uuid标识
 */
export const handleStartTextMessage = async function (event, uuid) {
  return new Promise((resolve, reject) => {
    try {
      const value = appConfig.textMessage.find((item) => item.uuid === uuid)
      console.log(value)
      const job = schedule.scheduleJob(value.cron, function () {
        console.log('Job 1: The answer to life, the universe, and everything!')
      })
      jobs.push({
        id: value.uuid,
        job
      })
      resolve(true)
    } catch (error) {
      reject(false)
    }
  })
}

/**
 * 监听停止提醒
 * @param {*} event
 * @param {*} uuid uuid标识
 */
export const handleEndTextMessage = async function (event, uuid) {}
