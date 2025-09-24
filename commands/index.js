import { dados } from "./dados.js";
import { ayuda } from "./ayuda.js";
import { ban } from "./ban.js";
import { unban } from "./unban.js";
import { white } from "./white.js";
import { unwhite } from "./unwhite.js";
import { fijar } from "./fijar.js";
import { desfijar } from "./desfijar.js";
import fs from "fs";

export async function comprobarMensaje(mensaje, ip, chatId, chatActual) {
    const salas = JSON.parse(fs.readFileSync("./listas/salas.json"));
    const administradores = JSON.parse(fs.readFileSync("./listas/administradores.json"));
    

    const comandos = {
        dados: { fn: (args) => dados(args[0]), roles: ["user", "admin"] },
        ayuda: { fn: () => ayuda(), roles: ["user", "admin"] },
        ban: { fn: (args, chatId) => ban(args[0], chatId), roles: ["admin"] },
        unban: { fn: (args, chatId) => unban(args[0], chatId), roles: ["admin"] },
        white: { fn: (args, chatId) => white(args[0], chatId), roles: ["admin"] },
        unwhite: { fn: (args, chatId) => unwhite(args[0], chatId), roles: ["admin"] },
        fijar: { fn: (args, chatId, chatActual) => fijar(args[0], chatActual), roles: ["admin"] },
        desfijar: { fn: (args, chatId, chatActual) => desfijar(args[0], chatActual), roles: ["admin"] }
    };

    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {            
            timestamp: Date.now(),
            usuario: `SISTEMA`
        }
    }

    const prefijo = process.env.PREFIJO || "/";

    const partes = mensaje.mensaje.slice(prefijo.length).trim().split(/\s+/);
    const nombreComando = partes[0];
    const argumentos = partes.slice(1);

    const rol = salas[chatId].administradores.includes(ip) || administradores.includes(ip) ? "admin" : "user";
    
    const cmd = comandos[nombreComando];
    if (!cmd) return propiedadesMensaje;

    if (!cmd.roles.includes(rol)) return propiedadesMensaje;

    propiedadesMensaje = await cmd.fn(argumentos, chatId, chatActual)

    return propiedadesMensaje
}
