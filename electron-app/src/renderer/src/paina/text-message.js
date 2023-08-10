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
    setMessageList(value) {
      console.log(value)
      this.messageList.push(value)
      console.log(this.messageList)
    }
  }
})
