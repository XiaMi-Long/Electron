import { app } from 'electron'

export const appConfig = {
  systemFileAddress: app.getAppPath(),
  appConfigFileName: 'app-config.json',
  appLogFileName: 'app-log.txt',
  user: {
    userName: 'C.C',
    userAvatarPath: '/images/user/avatar',
    userAvatarFileName: 'avatar.jpg'
  },
  background: {
    imageList: []
  }
}
