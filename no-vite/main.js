const { BrowserWindow, app, ipcMain } = require('electron')
const path = require('path')

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.resolve(__dirname, 'reload.js')
        }
    })

    // mainWindow.loadURL('https://www.electronjs.org/zh/docs/latest/tutorial/quick-start')
    mainWindow.loadFile(path.resolve(__dirname, 'index.html'))
})

ipcMain.on('console', () => {
    console.log("123123");
})