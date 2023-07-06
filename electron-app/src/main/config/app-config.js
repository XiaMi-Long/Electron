import { app } from 'electron'

export const appConfig = {
    systemFileAddress: app.getAppPath(),
    appConfigFileName: 'app-config.json',
    appLogFileName: 'app-log.txt',
    user: {
        userName: 'C.C',
        userAvatar: ''
    }
}