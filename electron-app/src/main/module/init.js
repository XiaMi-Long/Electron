const fs = require('fs');
const path = require('path');
const os = require('os');
import { pushLog, writeLogs, clearLogs } from '../common/log'
import { osConfig } from '../config/os-config'
import { appConfig } from '../config/app-config'


/**
 * 设置和读取软件默认本地配置文件
 */
export const initFileConfig = async function () {
    initAppLogFile()
    initAppConfig()
}

/**
 * 初始化日志文件
 * 1. 获取 app-log文件夹路径
 * 2. 获取 app-log文件路径
 * 3. 检查app-log文件目录是否存在
 * 4. 如果存在相应目录就创建日志文件,不存在相应目录就先创建目录再创建日志文件
 */
const initAppLogFile = async function () {
    const appLogFileName = appConfig.appLogFileName;
    const appLogFolderPath = path.join(appConfig.systemFileAddress)
    const appLogFilePath = path.join(appLogFolderPath, appLogFileName)
    const isAppLogFilePathAvailable = await fs.existsSync(appLogFolderPath)
    const writeAppLogFile = function () {
        // 如果路径文件存在就不创建文件
        if (fs.existsSync(appLogFilePath)) {
            return
        }

        // 开始创建日志文件
        fs.writeFile(appLogFilePath, '', err2 => {
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
        fs.mkdir(appLogFolderPath, { recursive: true }, err => {
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
        // 如果路径文件存在就不创建文件
        if (fs.existsSync(appConfigFilePath)) {
            return
        }

        const jsonData = JSON.stringify(appConfig)

        // 开始创建日志文件
        fs.writeFile(appConfigFilePath, jsonData, err2 => {
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

    // 如果不存在该目录,创建改目录再创建文件
    if (!isConfigFilePathAvailable) {
        fs.mkdir(appLogFolderPath, { recursive: true }, err => {
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