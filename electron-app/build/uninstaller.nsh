!macro customUnInstall
  ; 删除 app-config.json 文件
  Delete "$APPDATA\electron-app\app-config.json"
  ; 删除 app-log.txt 文件
  Delete "$APPDATA\electron-app\app-log.txt"
!macroend
