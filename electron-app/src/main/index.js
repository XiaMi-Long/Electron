import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { initFileConfig, handleInitRenderer } from './module/init'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { writeLog, pushLog, writeLogs, clearLogs } from './common/log'
import { handleBackgroundAddImage, initRendererImage } from './module/background/file'
import { handleSynchronizeLocalAppConfigFile } from './common/index'
import { handleImageFileOpen, handleUpdateLocalAvatarFile } from './module/user/file'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 670,
    // minWidth: 1200,
    // minHeight: 670,
    // maxWidth: 1200,
    // maxHeight: 900,
    show: false,
    minimizable: false,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.toggleDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // 初始化配置文件
  initFileConfig()
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 监听渲染进程初始化操作
  ipcMain.handle('init:init-renderer', handleInitRenderer)
  // 监听打开文件选择文件操作
  ipcMain.handle('dialog:openImageFile', handleImageFileOpen)
  // 监听更新本地头像文件
  ipcMain.handle('update:avatar-file', handleUpdateLocalAvatarFile)
  // 监听打开背景页面,读取本地配置图片
  ipcMain.handle('background:init:rendererImage', initRendererImage)
  // 监听用户上传背景图片
  ipcMain.handle('background:dialog:openImageFile', handleBackgroundAddImage)

  // 监听同步本地appconfig文件数据
  ipcMain.on('synchronize-local-app-config-file', handleSynchronizeLocalAppConfigFile)
  // 监听写入日志操作
  ipcMain.on('write-log', (event, str, type) => {
    writeLog(str, type)
  })
  // 监听写入多个日志操作
  ipcMain.on('push-log', (event, str, type) => [pushLog(str, type)])
  ipcMain.on('write-logs', () => [writeLogs()])
  // 监听清除日志数组
  ipcMain.on('clear-logs', () => {
    clearLogs()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
