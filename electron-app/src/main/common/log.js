import dayjs from 'dayjs'
const fs = require('fs');
const path = require('path');

import { osConfig } from '../config/os-config';
import { appConfig } from "../config/app-config"

/**
 * 立即写入日志
 * @param {*} str 
 */
export const writeLog = function (str, type = 'warning') {
    if (appConfig.systemFileAddress.length === 0) {
        throw new Error('无法找到系统路径')
    }

    let lineBreak = osConfig[process.platform].lineBreak
    const newLogStr = `【${dayjs().format('YYYY-MM-DD HH:mm:ss')}】${type}：${str}${lineBreak}`

    fs.appendFile(path.join(appConfig.systemFileAddress, appConfig.appLogFileName), newLogStr, err => {
        if (err) throw err
    })

}

/**
 * 同时写入多个日志
 * @param {*} str 
 */
export const writeLogs = function (str) {
    if (appConfig.systemFileAddress.length === 0) {
        throw new Error('无法找到系统路径')
    }
}