import * as http from 'http'
import * as path from 'path'
import { cacheControl } from './cacheController'
import {foundResponse, notFoundResponse} from "./responseHandlers";
import {isFileExist} from "../../common/utils";

const PathTo404 = path.join(process.cwd(), '/404.html')

export default async function(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    options: any,
) {
    let filePath = path.join(process.cwd(), request.url) || PathTo404
    if(cacheControl(request, response, options.cacheControl, filePath)) 
        //已304，停止后续逻辑
        return false
    
    const exist = await isFileExist(filePath)
    if (!exist) {
        if(filePath !== PathTo404){
            const exist404 = await isFileExist(PathTo404)
            if(exist404) {//查找并返回404文件内容
                filePath = PathTo404
            }else{//404文件也不存在，则返回默认内容
                notFoundResponse(response)
            }
        }else{
            notFoundResponse(response)
        }
    }

    //访问html则设置cookie
    if(/\.html$/.test(request.url) && options.cookies){
        const cookies = []
        Object.keys(options.cookies).forEach(key=>{
            const cookie = options.cookies[key]

            if(typeof cookie === 'object'){
                cookies.push(`${key}=${cookie.value + ';'}${cookie.httpOnly && 'HttpOnly'}`)
            }
            else cookies.push(`${key}=${cookie}`)
        })
        response.setHeader('Set-Cookie', cookies)
    }

    foundResponse(response, filePath)
}
