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
                return response.writeHead(200).end('auth successfully')
            }
        }
    }
    
    return response.writeHead(401, {
        'WWW-Authenticate': 'Basic'
    }).end()
}