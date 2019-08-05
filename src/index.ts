import * as http from 'http'
import * as path from 'path'

import { apiServe, assetServe } from './service'

export const Server = http.createServer((request, response) => {
    const target = request.url || '/404.html'
    const extname = path.extname(target)
    const serve = /^\.[a-zA-Z]\w*$/.test(extname) ? assetServe : apiServe
    serve(request, response)
})

const originalListen = Server.listen
Server.listen = function(){
    console.log('监听端口：'+arguments[0])
    return originalListen.apply(this, arguments)
}