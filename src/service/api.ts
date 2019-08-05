import * as http from 'http'
import { chain } from '../common/utils'

export default function(
    request: http.IncomingMessage,
    response: http.ServerResponse
) {
    chain(response).end('500')
}
