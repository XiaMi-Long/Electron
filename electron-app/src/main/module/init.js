const fs = require('fs');
const path = require('path');
const os = require('os');
import { appConfig } from '../config/app-config'


/**
 * 设置和读取软件默认本地配置文件
 */
export const initFileConfig = async function () {

    let basePath = '';
    const fileName = 'app-config.json';
    switch (process.platform) {
        case 'win32':
            // Windows 系统
            basePath = 'D:/EasyCC/config'; // 设置 Windows 上的基础路径（例如 D 盘）
            appConfig.systemFileAddress = 'D:/EasyCC/config/file-folder'
            break;
        case 'darwin':
            // macOS 系统
            basePath = '/Volumes/D/EasyCC/config';// 设置 macOS 上的基础路径（例如 D 盘）
            appConfig.systemFileAddress = '/Volumes/D/EasyCC/config/file-folder'
            break;
        default:
            // Linux 系统
            basePath = '/mnt/d/EasyCC/config'; // 设置 Linux 上的基础路径（例如 D 盘）
            appConfig.systemFileAddress = '/mnt/d/EasyCC/config/file-folder'
            break;
    }

    const jsonData = JSON.stringify(appConfig)
    const folderPath = path.join(basePath);
    const configFilePath = path.join(basePath, fileName)
    const res = await fs.existsSync(folderPath)
    // 如果存在
    if (res) {

    } else {
        console.log(folderPath, configFilePath);
        fs.mkdir(folderPath, { recursive: true }, err => {
            console.log(err);
            if (!err) {

                console.log(`创建${folderPath}目录成功`);

                fs.writeFile(configFilePath, jsonData, (err) => {
                    console.log(err);
                    if (err) {
                        console.log(`创建${configFilePath}目录失败,加入日志`);
                    };

                    if (!err) {
                        console.log(`创建${configFilePath}目录成功`);
                    }

                });

            }

            if (err) {
                console.log(`创建${folderPath}目录失败,加入日志`);
            }
        })

    }




}