const fs = require('fs')
const path = require('path')
import avatar from '../../../resources/avatar.jpg?asset'
import { appConfig, setAppConfig } from '../config/app-config'
import { pushLog, writeLogs, clearLogs } from '../common/log'

/**
 * 设置和读取软件默认本地配置文件
 */
export const initFileConfig = async function () {
  initAppLogFile()
  initAppConfig()
  initAvatar()
}

/**
 * 渲染进程初始化
 * 1. 传递头像base64给渲染进程
 */
export const handleInitRenderer = async function () {
  const fileData = fs.readFileSync(
    path.join(
      appConfig.systemFileAddress,
      appConfig.user.userAvatarPath,
      appConfig.user.userAvatarFileName
    ),
    { encoding: 'base64' }
  )
  const dataURL = `data:image/png;base64,${fileData}`
  return { avatarBase64: dataURL }
}

/**
 * 初始化日志文件
 * 1. 获取 app-log文件夹路径
 * 2. 获取 app-log文件路径
 * 3. 检查app-log文件目录是否存在
 * 4. 如果存在相应目录就创建日志文件,不存在相应目录就先创建目录再创建日志文件
 */
const initAppLogFile = async function () {
  const appLogFileName = appConfig.appLogFileName
  const appLogFolderPath = path.join(appConfig.systemFileAddress)
  const appLogFilePath = path.join(appLogFolderPath, appLogFileName)
  const isAppLogFilePathAvailable = await fs.existsSync(appLogFolderPath)
  const writeAppLogFile = function () {
    // 如果路径文件存在就不创建文件
    if (fs.existsSync(appLogFilePath)) {
      return
    }

    // 开始创建日志文件
    fs.writeFile(appLogFilePath, '', (err2) => {
      if (err2) {
        clearLogs()
        throw new Error(`创建${appLogFilePath}文件失败`)
      }

      if (!err2) {
        pushLog(`创建${appLogFilePath}文件成功`, 'success')
        writeLogs()
      }
    })
  }

  // 如果不存在该目录,创建改目录再创建文件
  if (!isAppLogFilePathAvailable) {
    fs.mkdir(appLogFolderPath, { recursive: true }, (err) => {
      if (err) {
        throw new Error(`创建${appLogFolderPath}目录失败`)
      }

      pushLog(`创建${appLogFolderPath}目录成功`, 'success')

      if (!err) {
        writeAppLogFile()
      }
    })
  }

  // 如果存在该目录,直接创建文件
  if (isAppLogFilePathAvailable) {
    writeAppLogFile()
  }
}

/**
 * 初始化appconfig文件
 * 1. 获取 app-config文件夹路径
 * 2. 获取 app-config文件路径
 * 3. 检查app-config文件目录是否存在
 * 4. 如果存在相应目录就创建应用全局配置文件,不存在相应目录就先创建目录再创建应用全局配置文件
 * 5. 如果要创建全局配置文件,就把app-config对象当做字符串写入进去
 */
const initAppConfig = async function () {
  const appConfigFileName = appConfig.appConfigFileName
  const appConfigFolderPath = path.join(appConfig.systemFileAddress)
  const appConfigFilePath = path.join(appConfigFolderPath, appConfigFileName)
  const isConfigFilePathAvailable = await fs.existsSync(appConfigFolderPath)
  const writeAppConfigFile = function () {
    // 如果路径文件存在就不创建文件,如果存在,就同步appconfig
    if (fs.existsSync(appConfigFilePath)) {
      fs.readFile(appConfigFilePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          writeLog(`同步${appConfigFilePath}文件失败`)
          throw err
        }

        if (!err) {
          setAppConfig(JSON.parse(data))
        }
      })
      return
    }

    // 处理\\字符串,把\\字符串转为\\\\字符
    const jsonData = JSON.stringify(appConfig).replace(/\\\\/g, '\\\\\\\\')

    // 开始创建日志文件
    fs.writeFile(appConfigFilePath, jsonData, { encoding: 'utf8' }, (err2) => {
      if (err2) {
        clearLogs()
        throw new Error(`创建${appConfigFilePath}文件失败`)
      }

      if (!err2) {
        pushLog(`创建${appConfigFilePath}文件成功`, 'success')
        writeLogs()
      }
    })
  }

  // 如果不存在该目录,创建该目录再创建文件
  if (!isConfigFilePathAvailable) {
    fs.mkdir(appLogFolderPath, { recursive: true }, (err) => {
      if (err) {
        throw new Error(`创建${appLogFolderPath}目录失败`)
      }

      pushLog(`创建${appConfigFolderPath}目录成功`, 'success')

      if (!err) {
        writeAppConfigFile()
      }
    })
  }

  // 如果存在该目录,直接创建文件
  if (isConfigFilePathAvailable) {
    writeAppConfigFile()
  }
}

/**
 * 初始化头像
 */
const initAvatar = async function () {
  const avatarFolderPath = path.join(appConfig.systemFileAddress, appConfig.user.userAvatarPath)
  const filePath = path.join(
    appConfig.systemFileAddress,
    appConfig.user.userAvatarPath,
    appConfig.user.userAvatarFileName
  )
  const isAvatarFilePathAvailable = await fs.existsSync(avatarFolderPath)
  const writeAvatarFile = function () {
    // 如果路径文件存在就不创建文件
    if (fs.existsSync(filePath)) {
      return
    }

    // 开始创建头像文件
    fs.copyFile(avatar, filePath, (err2) => {
      if (err2) {
        clearLogs()
        throw new Error(`创建${filePath}文件失败`)
      }

      if (!err2) {
        pushLog(`创建${filePath}文件成功`, 'success')
        writeLogs()
      }
    })
  }

  if (!isAvatarFilePathAvailable) {
    fs.mkdir(avatarFolderPath, { recursive: true }, (err) => {
      if (err) {
        throw new Error(`创建${avatarFolderPath}目录失败`)
      }

      pushLog(`创建${avatarFolderPath}目录成功`, 'success')

      if (!err) {
        writeAvatarFile()
      }
    })
  }

  // 如果存在该目录,直接创建文件
  if (isAvatarFilePathAvailable) {
    writeAvatarFile()
  }
}
