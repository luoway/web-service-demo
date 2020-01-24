import * as http from 'http'
import {getHandler, postHandler} from "./handleParam";
import {failHandler, forbiddenHandler, successHandler} from "./handlers";
import {handleCORS} from "./handleCORS";

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
        handleCORS(response)
        if(request.method === 'POST'){
            param = await postHandler(request)
        }else if(request.method === 'GET'){
            param = await getHandler(request)
        }else if(request.method === 'OPTIONS'){
            return successHandler(response, '')
        }

        if( target ){
            let result = null
            try{
                result = await target({request, response}, param)
            }catch(e){
                return failHandler(response, e)
            }
            return successHandler(response, result)
        }
    }
    
    return forbiddenHandler(response)
}
