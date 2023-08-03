import { Server, createWebSocketServer } from './src/index'
const args = process.argv[2]
let port = 9000
if(args){
    if(args.search('port=')>-1) {
        const match = args.match(/port=(\d+)/)
        if(match && match[1]){
            port = parseInt(match[1]) || port
        }
    }
}
Server.listen(port)
createWebSocketServer(port+1)