const fs = require('fs');
const path = require('path');
const os = require('os');
import { writeLog } from '../common/log'
import { osConfig } from '../config/os-config'
import { appConfig } from '../config/app-config'


/**
 * 设置和读取软件默认本地配置文件
 */
export const initFileConfig = async function () {



    const appConfigFileName = 'app-config.json';
    appConfig.systemFileAddress = osConfig[process.platform].systemFileAddress


    initAppLogFile()
    // 检查app-config文件是否存在
    // const res = await fs.existsSync(appConfigFolderPath)
    // // 如果存在
    // if (res) {

    // } else {
    //     console.log(appConfigFolderPath, appConfigFilePath);
    //     fs.mkdir(appConfigFolderPath, { recursive: true }, err => {
    //         console.log(err);
    //         if (!err) {

    //             console.log(`创建${appConfigFolderPath}目录成功`);

    //             fs.writeFile(appConfigFilePath, jsonData, (err) => {
    //                 console.log(err);
    //                 if (err) {
    //                     console.log(`创建${appConfigFilePath}目录失败,加入日志`);
    //                 };

    //                 if (!err) {
    //                     console.log(`创建${appConfigFilePath}目录成功`);
    //                 }

    //             });

    //         }

    //         if (err) {
    //             console.log(`创建${appConfigFolderPath}目录失败,加入日志`);
    //         }
    //     })

    // }
    // 




}

/**
 * 初始化日志文件
 */
const initAppLogFile = async function () {
    const appLogFileName = appConfig.appLogFileName;
    // app-log文件路径
    const appLogFolderPath = path.join(appConfig.systemFileAddress)
    const appLogFilePath = path.join(appConfig.appConfigFileName, appLogFileName)
    // 检查app-log文件目录是否存在
    const isAppLogFilePathAvailable = await fs.existsSync(appLogFolderPath)
    const writeAppLogFile = function () {
        // 如果路径文件存在就不创建文件
        if (fs.existsSync) {
            return
        }

        // 开始创建日志文件
        fs.writeFile(appLogFilePath, '', err2 => {
            if (err2) {
                throw new Error(`创建${appLogFilePath}文件失败`)
            }

            if (!err2) {
                console.log(`创建${appLogFilePath}文件成功`);
            }
        })

    }

    // 如果存在该目录
    if (!isAppLogFilePathAvailable) {
        fs.mkdir(appLogFolderPath, { recursive: true }, err => {
            if (err) {
                throw new Error(`创建${appLogFolderPath}目录失败`)
            }

            console.log(`创建${appLogFolderPath}目录成功`);

            if (!err) {
                writeAppLogFile()
            }
        })
    }

    if (isAppLogFilePathAvailable) {
        writeAppLogFile()
    }
}