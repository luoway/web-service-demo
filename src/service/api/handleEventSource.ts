/**
 * @Description: EventSource是一次长连接
 * 
 * @Author: luoway 
 * @Date: 2023-08-05 22:53:27 
 * @Last Modified by: luoway
 * @Last Modified time: 2023-08-05 23:59:42
 */

import * as http from "http";

export function handleEventSource(request: http.IncomingMessage, response: http.ServerResponse) {
    console.log(request.url)

    response.writeHead(200, {
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache",
      "Connection":"keep-alive",
      "Access-Control-Allow-Origin": '*',
    });

    const timeout = 4*1000
    const random = (Math.random()*1000).toFixed(0)
    response.write(`retry: ${timeout}\n\n`)
    response.write(`
id: ${random}
event: custom-event-connect
data: ${new Date()}

`)
    let interval = setInterval(() => {
        response.write(`:active\n\n`) //相当于注释，仅用于保持连接，浏览器不展示
    }, timeout/2)

    const handleClose = () => {
        console.log("客户端终止连接")
        clearInterval(interval)
        if(timer) clearInterval(timer)

        request.connection.removeListener("close", handleClose)
    }
    request.connection.addListener("close", handleClose)

    let count = 5
    let timer = setInterval(() => {
        response.write(`data: ${count}\n\n`)
        if(!count) {
            clearInterval(interval)
            clearInterval(timer)
            response.write(`
id: ${random}
event: custom-event-close
data: closed

`)
            setTimeout(() => {
                console.log("关闭EventSource连接")
                response.end()
            }, 1000)
        }
        
        count--
    }, 1000)

    // keep connection
}