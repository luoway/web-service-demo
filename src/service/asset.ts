import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import { chain } from '../common/utils'
import { staticAssetsMIME } from '../common/constants'

const PathTo404 = path.join(process.cwd(), '/404.html')

function isFileExist(filePath: string) {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            resolve(!err)
        })
    })
}

function foundResponse (response, filePath){
    const file = fs.readFileSync(filePath)
    const mime =
        staticAssetsMIME[path.extname(filePath).slice(1)] ||
        staticAssetsMIME.txt

    chain(response)
        .writeHead(200, {
            'content-type': mime,
        })
        .end(file)
}

function notFoundResponse (response){
    chain(response)
        .writeHead(404, {
            'content-type': staticAssetsMIME.txt,
        })
        .end('资源未找到')
}

export default async function(
    request: http.IncomingMessage,
    response: http.ServerResponse
) {
    let filePath = path.join(process.cwd(), request.url) || PathTo404
    const exist = await isFileExist(filePath)
    if (!exist) {
        if(filePath !== PathTo404){
            const exist404 = await isFileExist(PathTo404)
            if(exist404) {
                filePath = PathTo404
            }else{
                notFoundResponse(response)
            }
        }else{
            notFoundResponse(response)
        }
    }
    foundResponse(response, filePath)
}
