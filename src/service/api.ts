import * as http from 'http'
import { chain } from '../common/utils'

export default function(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    options: any,
) {
    chain(response).end('500')
}
