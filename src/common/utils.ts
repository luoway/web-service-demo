import * as fs from "fs";

export function chain(obj: any) {
    const proxy = new Proxy(obj, {
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver)
            if (typeof result === 'function') {
                return function() {
                    result.apply(target, arguments)
                    return proxy
                }
            } else {
                return result
            }
        },
        set() {
            return false
        },
    })
    return proxy
}

export function isFileExist(filePath: string) {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            resolve(!err)
        })
    })
}