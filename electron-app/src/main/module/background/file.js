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

  console.log(canceled)
  if (canceled) {
    return {
      errLogs: [],
      result: [],
      empty: true
    }
  }

  if (!canceled) {
    // 每条的数据记录
    const result = []
    // 记录出现的问题日志
    const errLogs = []
    const localFilePath = path.join(appConfig.systemFileAddress, appConfig.background.imagePath)
    // 查看是否有存储图片的本地目录
    const isFilePathAvailable = await fs.existsSync(localFilePath)

    // 如果不存在该目录,创建该目录再创建文件
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
      const err = fs.writeFileSync(filePath, fileBuffer)
      if (err) {
        writeLog(`${fileItem}文件读取失败`, 'error')
        errLogs.push(`${image.originImageName}文件读取失败`)
        return
      }

      if (!err) {
        writeLog(`${fileItem}文件上传完成`, 'success')
        result.push({ buff: fileBuffer, img: image })
        image.path = filePath
        appConfig.background.imageList.push(image)
      }
    })

    return {
      errLogs,
      result,
      empty: false
    }
  }
}

/**
 * 打开背景页面的时候,读取本地的文件回显
 */
export const initRendererImage = async function () {
  const images = appConfig.background.imageList
  const result = []
  images.forEach((file) => {
    // 读取文件
    const fileBuffer = fs.readFileSync(file.path, { encoding: null })
    result.push({ buff: fileBuffer, img: file })
  })

  return { result }
}
