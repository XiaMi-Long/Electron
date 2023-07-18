const fs = require('fs')
const path = require('path')
import { dialog } from 'electron'
import { writeLog } from '../../common/log'
import { appConfig } from '../../config/app-config'

/**
 * 打开文件模块返回url
 */
export const handleImageFileOpen = async function () {
  const { canceled, filePaths } = await dialog
    .showOpenDialog(null, {
      title: '选择图片',
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      properties: ['openFile']
    })
    .catch((err) => {
      writeLog(`{handleImageFileOpen方法}选择文件出现错误-${err}`, 'error')
    })

  if (!canceled) {
    const fileData = fs.readFileSync(filePaths[0], { encoding: 'base64' })
    const dataURL = `data:image/png;base64,${fileData}`
    return { url: dataURL, originUrl: filePaths[0], empty: false }
  }

  if (canceled) {
    return { url: '', originUrl: '', empty: true }
  }
}

/**
 * 更新头像的本地文件
 */
export const handleUpdateLocalAvatarFile = async function (event, url) {
  const origin = path.join(
    appConfig.systemFileAddress,
    appConfig.user.userAvatarPath,
    appConfig.user.userAvatarFileName
  )

  fs.copyFileSync(url, origin)
  return true
}
