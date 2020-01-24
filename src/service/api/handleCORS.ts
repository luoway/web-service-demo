import * as http from "http";

export function handleCORS(response: http.ServerResponse) {
    //设置允许跨的域
    response.setHeader('Access-Control-Allow-Origin', '*')
    //视预检请求放开跨域限制，如测试中预检请求content-type不在白名单内
    response.setHeader('Access-Control-Allow-Headers', '*')
}