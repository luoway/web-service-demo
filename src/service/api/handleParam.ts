import * as http from "http";
import * as qs from "querystring";
import {parse as multipartParse, getBoundary} from 'parse-multipart-data';
const fs = require('fs')
const path = require('path')

export async function getHandler(request: http.IncomingMessage) {
    const param = {}
    let url = request.url
    const searchIndex = url.indexOf('?')
    if(searchIndex > -1){
        url.slice(searchIndex+1).split('&').forEach(item=>{
            const parts = item.split('=')
            param[parts[0]] = parts[1]
        })
    }
    return param
}

export async function postHandler(request: http.IncomingMessage){
    const contentType = request && request.headers && request.headers['content-type']
    return new Promise((resolve, reject)=>{
        let body = ''
        request
            .on('data', chunk => body += chunk)
            .on('end', () => {
                let param = {}
                if(contentType === 'application/x-www-form-urlencoded'){
                    param = qs.parse(body)
                }
                else if(contentType.indexOf('multipart/form-data') > -1){
                    const boundary = getBoundary(contentType)
                    const data = multipartParse(Buffer.from(body), boundary)
                    data.forEach(part=>{
                        if(part.type){
                            if(part.type.indexOf('image/') === 0){
                                //@ts-ignore
                                part.data = '' //此处文件处理不正确
                            }
                        }else{
                            //@ts-ignore
                            return param[part.name] = part.data.toString('utf-8')
                        }
                        param[part.name] = {
                            ...part,
                            name: undefined
                        }
                    })
                }
                else if(contentType === 'text/plain'){
                    body.split('\r\n').forEach(item=>{
                        const firstEqual = item.indexOf('=')
                        if(firstEqual == -1) return
                        const key = item.substring(0, firstEqual)
                        const val = item.slice(firstEqual+1)
                        param[key] = val
                    })
                }
                else if(contentType === 'application/json'){
                    try {
                        param = JSON.parse(body)
                    }catch (e) {
                        console.log('JSON parse ERROR')
                    }
                }
                resolve(param)
            })
            .on('error', () => reject());
    })
}