import { limpiarIP } from "./limpiarIP.js";
import { comprobarMensaje } from '../commands/commands.js'

export function mandarMensaje(req, res, nombres, chat, id) {
    let nombreUsuario
    if (!nombres[limpiarIP(req.socket.remoteAddress) || "0.0.0.0"]) {
        nombreUsuario = limpiarIP(req.socket.remoteAddress)
    } else {
        nombreUsuario = nombres[limpiarIP(req.socket.remoteAddress)]
    }

    const mensaje = {
        id: id,
        timestamp: Date.now(),
        usuario: `${nombreUsuario} (${limpiarIP(req.socket.remoteAddress)})`,
        mensaje: req.body.mensaje
    }

    id++

    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {}
    }

    if (mensaje.mensaje.startsWith("/")) {
        propiedadesMensaje = comprobarMensaje(mensaje, chat, nombres, id)
    }

    if (propiedadesMensaje.mostrar) {
        chat.push(mensaje)
    }

    if (propiedadesMensaje.mensajeSistema.mensaje) {
        const mensajeSistema = {
            id: id,
            timestamp: Date.now(),
            usuario: "SISTEMA",
            mensaje: propiedadesMensaje.mensajeSistema.mensaje
        }

        chat.push(mensajeSistema)
        id++
    }

    chat = propiedadesMensaje.chat || chat
    nombres = propiedadesMensaje.nombres || nombres
    id = propiedadesMensaje.id || id

    console.log(`${"NUEVO MENSAJE".blue}: ${mensaje.id} ${mensaje.timestamp} ${mensaje.usuario} : ${mensaje.mensaje}`)

    res.send()
}