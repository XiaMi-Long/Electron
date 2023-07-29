// NODE
import path, { join } from 'path'

// ELECTRON
import { app, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// ICON
import icon from '../../resources/icon.png?asset'
import assets from './image/icon.png?asset'

// INIT
import { initFileConfig, handleInitRenderer } from './module/init'

// CONFIG
import { getAppConfig } from './config/app-config'

// LOG
import { writeLog, pushLog, writeLogs, clearLogs } from './common/log'

// BACKGROUND
import { handleStart, handleStop } from './module/background/service'
import {
  handleBackgroundAddImage,
  initRendererImage,
  handleDeleteImage
} from './module/background/file'

// COMMON
import {
  handleSynchronizeLocalAppConfigFileByWrite,
  handleSynchronizeLocalAppConfigFileByRead
} from './common/index'

// USER
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
    // skipTaskbar: true,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: assets
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
  const appTray = new Tray(assets)

  // 监听点击托盘图标事件
  // 点击托盘图标时显示/隐藏应用窗口
  appTray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

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
  // 监听渲染进程获取appconfig数据
  ipcMain.handle('get:get-appConfig', getAppConfig)
  // 监听背景图片删除
  ipcMain.handle('background:background-delete', handleDeleteImage)

  // 监听是否要同步本地最新文件数据到内存
  ipcMain.on('synchronizeLocalAppConfigByRead', handleSynchronizeLocalAppConfigFileByRead)
  // 监听背景切换开始
  ipcMain.on('background-start', handleStart)
  // 监听背景切换停止
  ipcMain.on('background-stop', handleStop)
  // 监听同步本地appconfig文件数据
  ipcMain.on('synchronize-local-app-config-file', handleSynchronizeLocalAppConfigFileByWrite)
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

  const mainWindow = createWindow()

  const mainWindowCloseHandler = (event) => {
    if (process.platform !== 'darwin') {
      event.preventDefault()
      mainWindow.hide()
    }
  }

  mainWindow.on('close', mainWindowCloseHandler)

  // 创建托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        // 在退出之前解除主窗口的'close'事件监听
        mainWindow.removeListener('close', mainWindowCloseHandler)
        app.quit()
      }
    }
  ])
  appTray.setContextMenu(contextMenu)

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

app.on('will-quit', () => {
  console.log(1)
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
