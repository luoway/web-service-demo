import * as http from 'http'

export default function (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    param: any,
){
    response.writeHead(302, {
        'Set-Cookie': `username=${param.username};Domain=${
            request.headers.host.split(':')[0]};Path=/`,
        'Location': `${request.headers.referer}`
    })
    response.end()
}