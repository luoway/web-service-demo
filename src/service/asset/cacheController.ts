import * as fs from 'fs'
import md5 from 'md5';
export function cacheControl(request, response, config, filePath){
    const val = config[request.url]
    if(val instanceof Function){
        response.setHeader('Expires', val())
    }else if(['no-store', 'no-cache', 'public', 'private'].includes(val)){
        response.setHeader('Cache-Control', val)
    }else if(typeof val === 'number'){
        response.setHeader('Cache-Control', `max-age=${val}`)
    }else if(['Modified','Etag'].includes(val)){
        //协商缓存
        response.setHeader('Cache-Control', 'no-cache')
        const headers = request && request.headers || {}
        if(val === 'Modified'){
            const stats = fs.statSync(filePath)
            response.setHeader('Last-Modified', stats.mtime)

            if(headers['if-modified-since']){
                const mtime = stats.mtime
                const time = new Date(headers['if-modified-since'])
                if(Number(mtime) <= Number(time) + 1000){
                    response.writeHead(304)
                    response.end()
                    return true
                }
            }

        }else if(val === 'Etag'){
            const fileMD5 = md5(fs.readFileSync(filePath))
            response.setHeader('Etag', fileMD5)

            const tag = headers['if-none-match']
            if(tag && tag === fileMD5){
                response.writeHead(304)
                response.end()
                return true
            }
        }
    }
    return false
}