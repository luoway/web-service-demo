const fs = require('fs');
const path  = require('path');
const Controller = {};

fs.readdirSync(path.join(__dirname ,'./methods')).filter(file => {
    if(/\w.js$/.test(file) && file !== 'index.js'){
        const filePath = path.join(__dirname, './methods', file)
        const mod = require(filePath)
        Controller[path.basename(file, '.js')] = mod.default
        return true
    }
    return false
})

export const api = Controller