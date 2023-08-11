import { defineStore } from 'pinia'

export const useTextMessageStore = defineStore('text-message', {
  // 其他配置...
  state: () => {
    return {
      messageList: []
    }
  },
  getters: {
    getMessageList() {
      return this.messageList
    }
  },
  actions: {
    /**
     * 添加提醒
     */
    async setMessageList(value) {
      // 解析时间位cron表达式
      const cron = generateCronExpression(value.time, value.timeType, value.week)
      // 向本地添加数据
      const isTrue = window.api.textMessage.pushTextMessage(
        JSON.stringify([...this.messageList, value]),
        cron
      )
      if (isTrue) {
        this.messageList.push(value)
      }
      return isTrue
    },

    /**
     * 更新数组
     * @param {*} list
     */
    async updateMessageList(list) {
      this.messageList = list
    }
  }
})

function generateCronExpression(timestamp, type, dayOfWeek) {
  let date = new Date(timestamp)
  let minute = date.getMinutes()
  let hour = date.getHours()
  let cronExpression = ''
  switch (type) {
    case 1:
      cronExpression = `${minute} ${hour} * * *`
      break
    case 2:
      cronExpression = `${minute} ${hour} * * *`
      break
    case 3:
      cronExpression = `${minute} ${hour} * * ${dayOfWeek}`
      break
    default:
      console.log('Invalid type')
  }
  return cronExpression
}
