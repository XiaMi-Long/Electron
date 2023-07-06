const fs = require('fs');
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
        const readStream = fs.createReadStream(filePaths[0]);
        const array = []
        let result = null
        let isRead = true
        readStream.on('data', (chunk) => {
            array.push(chunk)
        });

        readStream.on('end', () => {
            result = new Blob(array)
            isRead = false
        });

        readStream.on('error', (error) => {
            isRead = false
        });

        while (isRead) {
            if (isRead === false) {
                return result
            }
        }
    }
}