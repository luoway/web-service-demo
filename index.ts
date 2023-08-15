import { certificateFor } from 'devcert'
import { Server, createHttpsServer, createWebSocketServer } from './src/index'

const args = process.argv[2]
let port = 9000
if (args) {
    if (args.search('port=') > -1) {
        const match = args.match(/port=(\d+)/)
        if (match && match[1]) {
            port = parseInt(match[1]) || port
        }
    }
}

createWebSocketServer(port)
Server.listen(port+1, () => console.log(`http监听端口：${port+1}`))
// https证书必须用域名访问，localhost、ip都会报不安全
// 任意配置域名如test.com，在hosts文件中添加 127.0.0.1 test.com
certificateFor('test.com').then((ssl) => {
    const httpsPort = port + 2
    return createHttpsServer(ssl).listen(httpsPort, () =>
        console.log(`https监听端口：${httpsPort}`),
    )
})
