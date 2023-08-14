import { jobs } from './text-message/service'
import { writeLog } from '../common/log'

export const quit = function () {
  clearTextMessage()
}

/**
 * 清空消息提醒的事件
 */
const clearTextMessage = function () {
  jobs.map((item) => item.job.cancel())
  writeLog('系统退出:消息提醒已清除', 'info')
  console.log('消息提醒已清除')
}
