import { app } from 'electron'

let appConfig = {
  systemFileAddress: app.getAppPath(),
  appConfigFileName: 'app-config.json',
  appLogFileName: 'app-log.txt',
  user: {
    userName: 'C.C',
    userAvatarPath: '/images/user/avatar',
    userAvatarFileName: 'avatar.jpg'
  },
  background: {
    imagePath: '/images/background/',
    imageList: []
  }
}

const setAppConfig = (config) => (appConfig = config)
const getAppConfig = () => appConfig

export { appConfig, getAppConfig, setAppConfig }
