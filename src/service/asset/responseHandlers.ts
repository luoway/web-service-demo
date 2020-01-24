import * as fs from "fs";
import {staticAssetsMIME} from "../../common/constants";
import * as path from "path";
import {chain} from "../../common/utils";

export function foundResponse (response, filePath){
    const file = fs.readFileSync(filePath)
    const mime =
        staticAssetsMIME[path.extname(filePath).slice(1)] ||
        staticAssetsMIME.txt
    return chain(response)
        .writeHead(200, {
            'content-type': mime,
        })
        .end(file)
}

export function notFoundResponse (response){
    return chain(response)
        .writeHead(404, {
            'content-type': staticAssetsMIME.txt,
        })
        .end('资源未找到')
}