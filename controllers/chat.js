import { comprobarMensaje } from '../commands/index.js'
import { styleText } from "node:util";
import { limpiarIP } from "../functions/limpiarIP.js";
import fs from "fs/promises";

export async function enviarInfoSalas(req, res) {
    const infoSalas = JSON.parse(await fs.readFile("./listas/salas.json", "utf-8"));
    const ip = limpiarIP(req.socket.remoteAddress)

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
    const infoSalas = JSON.parse(await fs.readFile("./listas/salas.json", "utf-8"));
    const salaActual = infoSalas[chatId]
    const chatActual = JSON.parse(await fs.readFile(salaActual.archivo, "utf-8"));

    const ip = limpiarIP(req.socket.remoteAddress);
    let nombreUsuario;

    const nombres = JSON.parse(await fs.readFile("./listas/nombres.json", "utf-8"));
    
    if (!nombres[ip || "0.0.0.0"]) {
        nombreUsuario = ip;
    } else {
        nombreUsuario = nombres[ip];
    }

    const mensaje = {
        id: chatActual.length,
        timestamp: Date.now(),
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
            timestamp: Date.now(),
            usuario: "SISTEMA",
            fijado: false,
            mensaje: propiedadesMensaje.mensajeSistema.mensaje
        };

        chatActual.push(mensajeSistema);
    }

    console.log(`${styleText("blue", "NUEVO MENSAJE")}: ${chatId} | #${mensaje.id} | ${mensaje.timestamp} | ${ip} : ${mensaje.mensaje}`);

    fs.writeFile(salaActual.archivo, JSON.stringify(chatActual, null, 4));

    res.send()
}

export async function enviarChat(req, res) {
    const { chatId } = req.params;
    const infoSalas = JSON.parse(await fs.readFile("./listas/salas.json", "utf-8"));
    const salaActual = infoSalas[chatId]
    const chatActual = JSON.parse(await fs.readFile(salaActual.archivo, "utf-8"));

    const desdeId = parseInt(req.query.id, 10);
    const mensajes = Number.isNaN(desdeId)
        ? chatActual
        : chatActual.filter(e => e.id >= desdeId);

    res.json(mensajes);
}
