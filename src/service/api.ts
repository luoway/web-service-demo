import * as http from 'http'
import * as qs from 'querystring'
import { chain } from '../common/utils'

function acceptPost(request){
    const type = request && request.headers && request.headers['content-type']
    return new Promise((resolve, reject)=>{
        let body = ''
        request
            .on('data', chunk => body += chunk)
            .on('end', () => {
                let param = {}
                if(type === 'application/x-www-form-urlencoded'){
                    param = qs.parse(body)
                }
                else if(type.indexOf('multipart/form-data') > -1){
                    console.log(body)
                }
                else if(type === 'text/plain'){
                    body.split('\r\n').forEach(item=>{
                        const firstEqual = item.indexOf('=')
                        if(firstEqual == -1) return
                        const key = item.substring(0, firstEqual)
                        const val = item.slice(firstEqual+1)
                        param[key] = val
                    })
                }
                resolve(param)
            })
            .on('error', () => reject());
    })
}

function fail(
    response: http.ServerResponse, 
    data: any,
){
    console.error(data)
    return chain(response)
            .writeHead(500)
            .end(
`500 Service error:
${String(data)}`)
}

function success(
    response: http.ServerResponse, 
    data: any,
){
    let type = ''
    let result = ''
    if(typeof data === 'object') {
        type = 'application/json'
        result = JSON.stringify(data)
    }
    else if(typeof data === 'string') {
        type = 'text/plain'
        result = data
    }

    return chain(response)
            .writeHead(200, {
                'content-type': type
            }).end(result)
}

export default async function(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    options: any,
) {
    const parts = request.url.split('/')
    if(parts.length === 3){//暂仅支持 /api/actionName 
        const dir = parts[1]
        const action = parts[2]
        const target = options[dir] && options[dir][action]

        let param = {}
        if(request.method === 'POST'){
            try{
                param = await acceptPost(request)
            }catch(e){
                console.error(e)
            }
        }else if(request.method === 'GET'){
            let url = request.url
            const searchIndex = url.indexOf('?')
            if(searchIndex > -1){
                url.slice(searchIndex+1).split('&').forEach(item=>{
                    const parts = item.split('=')
                    param[parts[0]] = parts[1]
                })
            }
        }

        if(action === 'postCookie'){//特殊处理
            return target(request, response, param)
        } if( target ){
            let result
            try{
                result = await target(param)
            }catch(e){
                fail(response, e)
                return
            }
            return success(response, result)
        }
    }
    
    chain(response)
        .writeHead(403)
        .end('403 Forbidden')
}
