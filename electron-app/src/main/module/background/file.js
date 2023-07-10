const fs = require('fs')
const path = require('path')

import { dialog } from 'electron'
import { writeLog } from '../../common/log'
import { generateUUID } from '../../common/uuid'
import { appConfig } from '../../config/app-config'

/**
 * 处理背景页面选择图片
 * @param {*} event
 */
export const handleBackgroundAddImage = async function (event) {
  const { canceled, filePaths } = await dialog
    .showOpenDialog(null, {
      title: '选择图片',
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      properties: ['openFile', 'multiSelections']
    })
    .catch((err) => {
      writeLog(`{handleSynchronizeLocalAppConfigFile方法}选择文件出现错误-${err}`, 'error')
    })

  // 记录出现的问题日志
  const errLogs = []

  if (!canceled) {
    filePaths.forEach((fileItem) => {
      // 读取文件
      const fileBuffer = fs.readFileSync(fileItem, { encoding: null })
      // 生成uuid
      const fileUUid = generateUUID()
      console.log(fileBuffer)

      // 生成图片对象
      const image = {
        fileId: fileUUid,
        originImageName: basename.basename(fileItem),
        path: ''
      }

      // 获取后缀标识符和文件名
      const { imagePath } = appConfig.background
      const extname = path.extname(fileItem)
      // 如果没有后缀标识符
      if (extname.length === 0 || extname === '.') {
        writeLog(`${fileItem}文件没有后缀标识符,读取失败`, 'error')
        errLogs.log(`${imageObj.originImageName}文件没有后缀标识符,读取失败`)
        return
      }

      fs.writeFile(path.join(appConfig.systemFileAddress, imagePath, imageObj))
    })
  }
}

/**
 * 同步本地appconfig文件数据
 * @param {string} type 本地更新的标识字符串可以是任何值的字符串,可以用来表明什么操作之后进行的同步文件
 */
export const handleSynchronizeLocalAppConfigFile = async function (event, type) {}
