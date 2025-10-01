import { comprobarMensaje } from '../../../commands/index.js'
import { styleText } from "node:util";
import Utils from "../../../classes/Utils.js";
import Archivos from '../../../classes/Archivos.js';

export async function enviarInfoSalas(req, res) {
    const infoSalas = Archivos.devolverSalas()
    const ip = Utils.limpiarIP(req.socket.remoteAddress)

    const salasLimpias = Object.fromEntries(
    Object.entries(infoSalas).filter(([clave, e]) => {
        if (e.visibilidad === "publico") {
        return !e.blacklist.includes(ip);
        } else if (e.visibilidad === "privado") {
        return e.whitelist.includes(ip);
        }
    })
    );

    res.send(salasLimpias)
}

export async function recibirMensaje(req, res) {
    const chatId = req.params.chatId;
    const chatActual = Archivos.devolverChat(chatId)

    const ip = Utils.limpiarIP(req.socket.remoteAddress);
    let nombreUsuario;

    const nombres = Archivos.devolverNombres()
    
    if (!nombres[ip || "0.0.0.0"]) {
        nombreUsuario = ip;
    } else {
        nombreUsuario = nombres[ip];
    }

    const mensaje = {
        id: chatActual.length,
        timestamp: Date.now(),
        medalla: "bronce",
        usuario: `${nombreUsuario}`,
        fijado: false,
        mensaje: req.body.mensaje
    };

    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {}
    };

    if (mensaje.mensaje.startsWith(process.env.PREFIJO)) {
        propiedadesMensaje = await comprobarMensaje(mensaje, ip, chatId, chatActual);
    }
    
    if (propiedadesMensaje.mostrar) {
        chatActual.push(mensaje);
    }

    if (propiedadesMensaje.mensajeSistema.mensaje) {
        const mensajeSistema = {
            id: chatActual.length,
            medalla: "bronce",
            timestamp: Date.now(),
            usuario: "SISTEMA",
            fijado: false,
            mensaje: propiedadesMensaje.mensajeSistema.mensaje
        };

        chatActual.push(mensajeSistema);
    }

    console.log(`${styleText("blue", "NUEVO MENSAJE")}: ${chatId} | #${mensaje.id} | ${mensaje.timestamp} | ${ip} : ${mensaje.mensaje}`);

    Archivos.escribirChat(chatId, chatActual)

    res.send()
}

export async function enviarChat(req, res) {
    const { chatId } = req.params;
    const chatActual = Archivos.devolverChat(chatId)

    const desdeId = parseInt(req.query.id, 10);
    const mensajes = Number.isNaN(desdeId)
        ? chatActual
        : chatActual.filter(e => e.id >= desdeId);

    res.json(mensajes);
}
