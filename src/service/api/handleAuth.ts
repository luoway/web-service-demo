import * as http from "http";

const username = 'admin'
const password = 'password'

export function handleAuth(request: http.IncomingMessage, response: http.ServerResponse) {
    const auth = request.headers.authorization
    if(auth){
        const [type, data] = auth.split(/\s/)
        if(type === 'Basic'){
            const authDecoded = Buffer.from(data, 'base64').toString()
            if(authDecoded === `${username}:${password}`){
                response.writeHead(200)
                return response.end('auth successfully')
            }
        }
    }

    response.writeHead(401, {
        'WWW-Authenticate': 'Basic'
    })
    return response.end()
}