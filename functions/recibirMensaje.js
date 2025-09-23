import { comprobarMensaje } from '../commands/index.js'
import { styleText } from "node:util";
import { limpiarIP } from "./limpiarIP.js";

export async function recibirMensaje(req, res) {
    const ip = limpiarIP(req.socket.remoteAddress);
    let nombreUsuario;
    
    if (!global.nombres[ip || "0.0.0.0"]) {
        nombreUsuario = ip;
    } else {
        nombreUsuario = global.nombres[ip];
    }

    const mensaje = {
        id: global.id,
        timestamp: Date.now(),
        usuario: `${nombreUsuario}`,
        mensaje: req.body.mensaje
    };

    global.id++;

    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {}
    };

    if (mensaje.mensaje.startsWith(process.env.PREFIJO)) {
        propiedadesMensaje = await comprobarMensaje(mensaje, ip);
    }

    if (propiedadesMensaje.mostrar) {
        global.chat.push(mensaje);
    }

    if (propiedadesMensaje.mensajeSistema.mensaje) {
        const mensajeSistema = {
            id: global.id,
            timestamp: Date.now(),
            usuario: "SISTEMA",
            mensaje: propiedadesMensaje.mensajeSistema.mensaje
        };

        global.chat.push(mensajeSistema);
        global.id++;
    }

    console.log(`${styleText("blue", "NUEVO MENSAJE")}: #${mensaje.id} ${mensaje.timestamp} ${ip} : ${mensaje.mensaje}`);

    res.send();
}
