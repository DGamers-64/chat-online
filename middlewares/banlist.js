import Utils from "../classes/Utils.js";
import Archivos from "../classes/Archivos.js";

export async function banlist(req, res, next) {
    const blacklist = Archivos.devolverBlacklist()
    const whitelist = Archivos.devolverWhitelist()
    const ip = Utils.limpiarIP(req.socket.remoteAddress)

    if (blacklist.includes(ip) && process.env.PUBLICO === "true") {
        return res.status(403).send("<h1>Error 403: Acceso denegado</h1>")
    } else if (!whitelist.includes(ip) && process.env.PUBLICO === "false") {
        return res.status(403).send("<h1>Error 403: Acceso denegado</h1>")
    }

    next()
}