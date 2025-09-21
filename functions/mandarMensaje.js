import { comprobarMensaje } from '../commands/commands.js'
import { styleText } from "node:util";
import { limpiarIP } from "./limpiarIP.js";
import { logger } from "./logger.js";

export function mandarMensaje(req, res) {
    let nombreUsuario
    if (!global.nombres[limpiarIP(req.socket.remoteAddress) || "0.0.0.0"]) {
        nombreUsuario = limpiarIP(req.socket.remoteAddress)
    } else {
        nombreUsuario = global.nombres[limpiarIP(req.socket.remoteAddress)]
    }

    const mensaje = {
        id: global.id,
        timestamp: Date.now(),
        usuario: `${nombreUsuario}`,
        mensaje: req.body.mensaje
    }

    global.id++

    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {}
    }

    if (mensaje.mensaje.startsWith("/")) {
        propiedadesMensaje = comprobarMensaje(mensaje)
    }

    if (propiedadesMensaje.mostrar) {
        global.chat.push(mensaje)
    }

    if (propiedadesMensaje.mensajeSistema.mensaje) {
        const mensajeSistema = {
            id: global.id,
            timestamp: Date.now(),
            usuario: "SISTEMA",
            mensaje: propiedadesMensaje.mensajeSistema.mensaje
        }

        global.chat.push(mensajeSistema)
        global.id++
    }

    logger(`${styleText("blue", "NUEVO MENSAJE")}: #${mensaje.id} ${mensaje.timestamp} ${limpiarIP(mensaje.usuario)} : ${mensaje.mensaje}`)

    res.send()
}