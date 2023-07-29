import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 初始化渲染进程时,需要进行的操作
  initRenderer: () => ipcRenderer.invoke('init:init-renderer'),
  user: {
    // 选择头像时候的时候,需要打开的文件选择框
    selectFile: () => ipcRenderer.invoke('dialog:openImageFile'),
    // 头像更新完,更新本地头像文件
    updateLocalAvatarFile: (originUrl) => ipcRenderer.invoke('update:avatar-file', originUrl)
  },

  background: {
    // 打开背景页面的时候,读取本地的文件回显
    initRendererImage: () => ipcRenderer.invoke('background:init:rendererImage'),
    // 添加背景时候的,打开文件选择框
    handleBackgroundAddImage: (uuidCallBack) =>
      ipcRenderer.invoke('background:dialog:openImageFile', uuidCallBack),
    // 删除图片
    handleDeleteImage: (imgUrl) => ipcRenderer.invoke('background:background-delete', imgUrl),
    // 开始背景切换
    handleStart: (form) => ipcRenderer.send('background-start', form),
    // 停止背景切换
    handleStop: () => ipcRenderer.send('background-stop')
  },

  // 同步本地appconfig文件数据
  synchronizeLocalAppConfigFile: (appConfig, type) =>
    ipcRenderer.send('synchronize-local-app-config-file', appConfig, type),

  get: {
    // 获取appconfig配置
    getAppConfig: () => ipcRenderer.invoke('get:get-appConfig')
  },

  common: {
    synchronizeLocalAppConfigByRead: () => ipcRenderer.send('synchronizeLocalAppConfigByRead')
  },

  // 日志操作
  logs: {
    // 一次性写入全部日志
    writeLogs: () => ipcRenderer.send('write-logs'),
    // 清除日志数组
    clearLogs: () => ipcRenderer.send('clear-logs'),
    // 写入一次日志记录
    writeLog: (str, type) => ipcRenderer.send('write-log', str, type),
    // 向日志数组里面推入一条,待一次性写入
    pushLog: (str, type) => ipcRenderer.send('push-log', str, type)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
