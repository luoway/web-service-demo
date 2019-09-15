import * as fs from 'fs'
export function cacheControl(request, response, config, filePath){
    const val = config[request.url]
    if(val instanceof Date){
        response.setHeader('Expires', val)
    }else if(['no-store', 'no-cache', 'public', 'private'].includes(val)){
        response.setHeader('Cache-Control', val)
    }else if(typeof val === 'number'){
        response.setHeader('Cache-Control', `max-age=${val}`)
    }else if(['Modified'].includes(val)){//协商缓存
        const stats = fs.statSync(filePath)
        response.setHeader('Cache-Control', 'no-cache')
        val === 'Modified' && response.setHeader('Last-Modified', stats.mtime)

        if(request && request.headers && request.headers['if-modified-since']){
            const mtime = stats.mtime
            const time = new Date(request.headers['if-modified-since'])
            if(Number(mtime) <= Number(time) + 1000){
                response.writeHead(304)
                response.end()
                return true
            }
        }
    }
    return false
}