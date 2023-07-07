import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    // 其他配置...
    state: () => {
        return {
            userAvatarBase64: ''
        }
    },
    getters: {

    },
    actions: {
        /**
         * 设置用户头像
         * @param {*} base64Str 用户头像的base64字符串 
         */
        setUserAvatarBase64 (base64Str) {
            window.api.logs.writeLog('用户更换头像', 'success')
            this.userAvatarBase64 = base64Str
        },
    },
})