const { BrowserWindow, app } = require('electron')
const path = require('path')

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800
    })

    // mainWindow.loadURL('https://www.electronjs.org/zh/docs/latest/tutorial/quick-start')
    mainWindow.loadFile(path.resolve(__dirname, 'index.html'))
})