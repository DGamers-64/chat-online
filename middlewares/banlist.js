import fs from "fs/promises";
import { limpiarIP } from "../functions/limpiarIP.js";

export async function banlist(req, res, next) {
    const blacklist = JSON.parse(await fs.readFile("./listas/blacklist.json", "utf8"))
    const whitelist = JSON.parse(await fs.readFile("./listas/whitelist.json", "utf8"))
    const ip = limpiarIP(req.socket.remoteAddress)

    if (blacklist.includes(ip) && process.env.PUBLICO === "true") {
        return res.status(403).send("<h1>Error 403: Acceso denegado</h1>")
    } else if (!whitelist.includes(ip) && process.env.PUBLICO === "false") {
        return res.status(403).send("<h1>Error 403: Acceso denegado</h1>")
    }

    next()
}