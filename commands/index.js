import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

import dados from "./dados.js";
import ayuda from "./ayuda.js";
import ban from "./ban.js";
import unban from "./unban.js";
import white from "./white.js";
import unwhite from "./unwhite.js";
import fijar from "./fijar.js";
import desfijar from "./desfijar.js";

function cargarComandosNativos() {
    return [
        dados,
        ayuda,
        ban,
        unban,
        white,
        unwhite,
        fijar,
        desfijar
    ];
}

export async function comprobarMensaje(mensaje, ip, chatId, chatActual) {
    const salas = JSON.parse(fs.readFileSync("./listas/salas.json"));
    const administradores = JSON.parse(fs.readFileSync("./listas/administradores.json"));

    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {            
            timestamp: Date.now(),
            usuario: `SISTEMA`
        }
    };

    const prefijo = process.env.PREFIJO || "/";
    if (!mensaje.mensaje.startsWith(prefijo)) return propiedadesMensaje;

    const partes = mensaje.mensaje.slice(prefijo.length).trim().split(/\s+/);
    const nombreComando = partes[0];
    const args = partes.slice(1);

    const rol = salas[chatId].administradores.includes(ip) || administradores.includes(ip) 
        ? "admin" 
        : "user";

    const comandos = {};
    for (const cmd of cargarComandosNativos()) {
        comandos[cmd.name] = cmd;
    }

    const comandosMods = await cargarComandosMods();
    Object.assign(comandos, comandosMods);

    const cmd = comandos[nombreComando];
    if (!cmd) return propiedadesMensaje;
    if (!cmd.roles.includes(rol)) return propiedadesMensaje;

    propiedadesMensaje = await cmd.execute({ 
        args, 
        ip, 
        chatId, 
        chatActual, 
        salas, 
        administradores, 
        rol,
        comandos
    });

    return propiedadesMensaje;
}

async function cargarComandosMods() {
    const modsConfig = JSON.parse(fs.readFileSync("./listas/mods.json"));
    const comandos = {};

    for (const [modName, config] of Object.entries(modsConfig)) {
        if (config.commands) {
            const commandsPath = path.join("./mods", modName, "commands");

            if (!fs.existsSync(commandsPath)) continue;

            const files = fs.readdirSync(commandsPath);
            for (const file of files) {
                if (file.endsWith(".js")) {
                    const fullPath = path.resolve(commandsPath, file);
                    const comando = (await import(pathToFileURL(fullPath))).default;
                    comandos[comando.name] = comando;
                }
            }
        }
    }

    return comandos;
}