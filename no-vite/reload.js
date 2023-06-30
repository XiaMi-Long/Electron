const { ipcRenderer, contextBridge } = require("electron");

ipcRenderer.send('console')

contextBridge.exposeInMainWorld('exports', {
    name: 'wwy'
})