import * as http from 'http'
import * as path from 'path'

import { apiServe, assetServe } from './service'
import { api } from '../api';
export * from './service/webSockets/serve'

const cacheControl = {
    '/index.html': 'no-store',
    '/404.html': () => new Date(Date.now() + 60 * 1000),
    '/cache-control/Expires.css': () => new Date(Date.now() + 10 * 1000),
    '/cache-control/max-age.css': 10,
    '/cache-control/public.css': 'public',
    '/cache-control/private.css': 'private',
    '/cache-control/Last-Modified.css': 'Modified',
    '/cache-control/Etag.css': 'Etag',
}

export const Server = http.createServer((
    request,
    response
) => {
    if(request.url.length < 2) request.url = '/index.html'
    const target = request.url
    const extname = path.extname(target)
    const isAsset = /^\.[a-zA-Z]\w*$/.test(extname)
    if(isAsset){
        assetServe(request, response, {
            cacheControl,
            cookies:{
                timestamp: Date.now(),
                httpOnly: {
                    value: 'true',
                    httpOnly: true,
                }
            }
        })
    }else{
        apiServe(request, response, {
            api
        })
    }
})

const originalListen = Server.listen
Server.listen = function(){
    console.log('监听端口：'+arguments[0])
    return originalListen.apply(this, arguments)
}