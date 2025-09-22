import { comprobarMensaje } from '../commands/commands.js'
import { styleText } from "node:util";
import { limpiarIP } from "./limpiarIP.js";
import { logger } from "./logger.js";
import blacklist from "../data/blacklist.json" with { type: "json" };
import whitelist from "../data/whitelist.json" with { type: "json" };

export async function recibirMensaje(req, res) {
    const ip = limpiarIP(req.socket.remoteAddress);
    const esPublico = process.env.PUBLICO === "true";
    let debeBloquear = false;

    if (esPublico) {
        debeBloquear = blacklist.includes(ip);
    } else {
        debeBloquear = !whitelist.includes(ip);
    }

    if (debeBloquear) {
        res.send();
        console.log(`${ip} ha intentado mandar un mensaje: ${req.body.mensaje}`);
        logger(`${ip} ha intentado mandar un mensaje: ${req.body.mensaje}\n`);
        return;
    }

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
        propiedadesMensaje = comprobarMensaje(mensaje, limpiarIP(req.socket.remoteAddress));
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
    logger(`NUEVO MENSAJE: #${mensaje.id} ${mensaje.timestamp} ${ip} : ${mensaje.mensaje}\n`);

    res.send();
}
