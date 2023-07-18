const fs = require('fs')
const path = require('path')
import { writeLog } from './log'
import { appConfig, setAppConfig } from '../config/app-config'
/**
 * 渲染进程同步数据到本地appconfig文件数据
 * @param {string} type 本地更新的标识字符串可以是任何值的字符串,可以用来表明什么操作之后进行的同步文件
 */
export const handleSynchronizeLocalAppConfigFileByWrite = async function (event, type) {
  const jsonData = JSON.stringify(appConfig)
  const appConfigFilePath = path.join(appConfig.systemFileAddress, appConfig.appConfigFileName)
  // 开始创建日志文件
  fs.writeFile(appConfigFilePath, jsonData, (err2) => {
    if (err2) {
      writeLog(`在${type}之后更新同步${appConfigFilePath}文件失败`, 'error')
    }

    if (!err2) {
      writeLog(`在${type}之后更新同步${appConfigFilePath}文件成功`, 'success')
    }
  })
}

/**
 * 同步本地最新文件数据到内存的appconfig文件数据
 */
export const handleSynchronizeLocalAppConfigFileByRead = async function () {
  const appConfigFilePath = path.join(appConfig.systemFileAddress, appConfig.appConfigFileName)
  const data = fs.readFileSync(appConfigFilePath, { encoding: 'utf-8' })
  setAppConfig(JSON.parse(data))
}
