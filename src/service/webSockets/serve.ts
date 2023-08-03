import { WebSocketServer } from 'ws'

export function createWebSocketServer(port) {
    const wss = new WebSocketServer({ port })
    console.log('ws监听端口：', port)

    wss.on('connection', function connection(ws) {
        let count = 10
        let timer = null
        ws.on('error', console.error)

        ws.on('message', function message(data) {
            console.log('received: %s', data)
            ws.send(`server accepted: ${data}`)
        })
        
        timer = setInterval(() => {
            if(!count) {
                clearInterval(timer)
                ws.send('服务端关闭ws连接')
                return ws.close()
            }
            ws.send(`[${new Date().toLocaleTimeString('zh', {hour12: false})}] ${count}`)
            count--
        }, 1000)
    })
}
