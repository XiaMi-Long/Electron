import { appConfig } from '../../config/app-config'
import { handleSynchronizeLocalAppConfigFileByWrite } from '../../common'

/**
 * 添加消息提醒后
 * @param {*} event
 * @param {*} value
 */
export const handlePushTextMessage = async function (event, value, cron) {
  return new Promise((resolve, reject) => {
    console.log(cron)
    try {
      appConfig.textMessage = JSON.parse(value)
      handleSynchronizeLocalAppConfigFileByWrite(null, '在添加消息提醒后更新文件')
      resolve(true)
    } catch (error) {
      reject(false)
    }
  })
}
