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

  if (!canceled) {
    // 记录出现的问题日志
    const errLogs = []
    const localFilePath = path.join(appConfig.systemFileAddress, appConfig.background.imagePath)
    // 查看是否有存储图片的本地目录
    const isFilePathAvailable = await fs.existsSync(localFilePath)

    // 如果不存在该目录,创建改目录再创建文件
    if (!isFilePathAvailable) {
      fs.mkdir(localFilePath, { recursive: true }, (err) => {
        if (err) {
          writeLog(`创建${localFilePath}目录失败`, 'error')
          throw err
        }
        writeLog(`创建${localFilePath}目录成功`, 'success')
      })
    }

    // 循环读取选择的图片进行处理
    filePaths.forEach((fileItem) => {
      // 读取文件
      const fileBuffer = fs.readFileSync(fileItem, { encoding: null })
      // 生成uuid
      const fileUUid = generateUUID()
      // 生成图片对象
      const image = {
        fileId: fileUUid,
        originImageName: path.basename(fileItem),
        path: ''
      }

      // 获取后缀标识符和文件名
      const { imagePath } = appConfig.background
      const extname = path.extname(fileItem)

      // 如果没有后缀标识符
      if (extname.length === 0 || extname === '.') {
        writeLog(`${fileItem}文件没有后缀标识符,读取失败`, 'error')
        errLogs.push(`${image.originImageName}文件没有后缀标识符,读取失败`)
        return
      }

      const filePath = path.join(appConfig.systemFileAddress, imagePath, image.fileId + extname)

      // 如果有后缀就用uuid加后缀的存储方式
      fs.writeFile(filePath, fileBuffer, (err) => {
        if (err) {
          writeLog(`${fileItem}文件读取失败`, 'error')
          errLogs.push(`${image.originImageName}文件读取失败`)
          return
        }

        if (!err) {
          writeLog(`${fileItem}文件上传完成`, 'success')
          image.path = filePath
          appConfig.background.imageList.push(image)
        }
      })
    })

    return {
      errLogs
    }
  }
}

/**
 * 同步本地appconfig文件数据
 * @param {string} type 本地更新的标识字符串可以是任何值的字符串,可以用来表明什么操作之后进行的同步文件
 */
export const handleSynchronizeLocalAppConfigFile = async function (event, type) {
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
