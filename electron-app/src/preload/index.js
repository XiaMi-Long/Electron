import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  initRenderer: () => ipcRenderer.invoke('init:init-renderer'),
  selectFile: () => ipcRenderer.invoke('dialog:openImageFile'),
  logs: {
    writeLogs: () => ipcRenderer.send('write-logs'),
    clearLogs: () => ipcRenderer.send('clear-logs'),
    writeLog: (str, type) => ipcRenderer.send('write-log', str, type),
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
