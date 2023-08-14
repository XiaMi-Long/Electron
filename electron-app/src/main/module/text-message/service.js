import { writeLog } from '../../common/log'
import { appConfig } from '../../config/app-config'
import { handleSynchronizeLocalAppConfigFileByWrite } from '../../common'

export const jobs = []
const axios = require('axios')
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
      const job = schedule.scheduleJob(value.cron, function () {
        sendMessage(value.phone, value.content, uuid)
      })
      jobs.push({
        id: value.uuid,
        job
      })
      writeLog(`已添加${uuid}-消息提醒`, 'info')
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
export const handleEndTextMessage = async function (event, uuid) {
  return new Promise((resolve, reject) => {
    try {
      const value = jobs.find((item) => item.id === uuid)
      value.job.cancel()
      console.log('消息提醒取消')
      writeLog(`${uuid}-消息提醒已取消`, 'info')
      resolve(true)
    } catch (error) {
      reject(false)
    }
  })
}

/**
 * 发送短信
 */
const sendMessage = async function (phoneNumber, content, uuid) {
  const res = await axios({
    method: 'post',
    url: 'https://uni.apistd.com',
    params: {
      action: 'sms.message.send',
      accessKeyId: 'ma24B3SgPAwNg69E3CD2eP8KFr5BkvEtrqLJtpYDE1tnxBF2a'
    },
    data: {
      to: phoneNumber,
      signature: 'easy-util来源短信',
      content: content
    },
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.code === 0) {
    writeLog(
      `${uuid}-短信发送成功至手机号为${phoneNumber}, 内容为${content},短信签名为${
        easy - util来源短信
      }`,
      'success'
    )
  }

  if (res.code !== 0) {
    writeLog(`${uuid}-短信发送失败，错误状态码为${res.code}`, 'error')
  }
  console.log(res)
}
