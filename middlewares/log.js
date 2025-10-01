import path from "path";
import Utils from "../classes/Utils.js";
import fs from "fs";

export function logger(req, res, next) {
    if (req.method == "GET" && req.path == "/chat") {
        next()
    } else {
        const texto = `${Utils.limpiarIP(req.socket.remoteAddress)}: ${req.method} -> ${req.path}\n`
    
        fs.appendFile(path.join('./console.log'), texto, (err) => {
            if (err) {
                console.error('Error:', err)
            }
        })
    
        next()
    }
}