import dayjs from 'dayjs'
const fs = require('fs');
const path = require('path');

import { osConfig } from '../config/os-config';
import { appConfig } from "../config/app-config"

// 无法保证多线程安全
let logs = []

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
 * 暂时存储日志
 * @param {*} str 
 */
export const pushLog = function (str, type = 'warning') {
    let lineBreak = osConfig[process.platform].lineBreak
    const newLogStr = `【${dayjs().format('YYYY-MM-DD HH:mm:ss')}】${type}：${str}${lineBreak}`
    logs.push(newLogStr)
}

/**
 * 写入之前存储的日志
 */
export const writeLogs = function () {
    if (appConfig.systemFileAddress.length === 0) {
        throw new Error('无法找到系统路径')
    }
    const newLogStr = logs.reverse().join('')
    fs.appendFile(path.join(appConfig.systemFileAddress, appConfig.appLogFileName), newLogStr, err => {
        if (err) throw err
        if (!err) {
            // 如果写入成功
            logs = []
        }
    })
}

/**
 * 主动清空logs
 */
export const clearLogs = function () {
    logs = []
}