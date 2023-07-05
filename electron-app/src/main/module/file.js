import { dialog } from 'electron'
/**
 * 打开文件模块返回url
 */
export const handleImageFileOpen = async function () {
    const { canceled, filePaths } = await dialog.showOpenDialog(null, {
        title: '选择图片',
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
        ],
        properties: [
            'openFile',
        ],
    }).catch(err => {
        console.log(err);
    })
    if (!canceled) {
        return filePaths[0]
    }
}