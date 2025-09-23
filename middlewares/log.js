import fs from "fs";
import path from "path";
import { limpiarIP } from "../functions/limpiarIP.js";

export function logger(req, res, next) {
    if (req.method == "GET" && req.path == "/chat") {
        next()
    } else {
        const texto = `${limpiarIP(req.socket.remoteAddress)}: ${req.method} -> ${req.path}\n`
    
        fs.appendFile(path.join('./console.log'), texto, (err) => {
            if (err) {
                console.error('Error:', err)
            }
        })
    
        next()
    }
}