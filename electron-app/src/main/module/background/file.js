const fs = require('fs')
const path = require('path')
import { appConfig } from '../../config/app-config'
import { dialog } from 'electron'

/**
 * 同步本地appconfig文件数据
 * @param {string} type 本地更新的标识字符串可以是任何值的字符串,可以用来表明什么操作之后进行的同步文件
 */
export const handleSynchronizeLocalAppConfigFile = async function (event, type) {
  const { canceled, filePaths } = await dialog
    .showOpenDialog(null, {
      title: '选择图片',
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      properties: ['openFile', 'multiSelections']
    })
    .catch((err) => {
      writeLog(`{handleSynchronizeLocalAppConfigFile方法}选择文件出现错误-${err}`, 'error')
    })

  if (!canceled) {
    console.log(filePaths)
  }
}
