import * as http from "http";
import {chain} from "../../common/utils";

export function failHandler(
    response: http.ServerResponse,
    data: any,
){
    console.error(data)
    return chain(response)
        .writeHead(500)
        .end(`500 Service error:
${String(data)}`)
}

export function successHandler(
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

export function forbiddenHandler(response: http.ServerResponse) {
    return chain(response)
        .writeHead(403)
        .end('403 Forbidden')
}