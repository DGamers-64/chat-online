import { dados } from "./dados.js";
import { ayuda } from "./ayuda.js";
import { ban } from "./ban.js";
import { unban } from "./unban.js";
import { white } from "./white.js";
import { unwhite } from "./unwhite.js";
import { fijar } from "./fijar.js";
import { desfijar } from "./desfijar.js";
import salas from "../listas/salas.json" with { type: "json" };

export async function comprobarMensaje(mensaje, ip, chatId, chatActual) {
    const comandos = {
        dados: { fn: (args) => dados(args[0]), roles: ["user", "admin"] },
        ayuda: { fn: () => ayuda(), roles: ["user", "admin"] },
        ban: { fn: (args) => ban(args[0]), roles: ["admin"] },
        unban: { fn: (args) => unban(args[0]), roles: ["admin"] },
        white: { fn: (args) => white(args[0]), roles: ["admin"] },
        unwhite: { fn: (args) => unwhite(args[0]), roles: ["admin"] },
        fijar: { fn: (args, chat) => fijar(args[0], chat), roles: ["admin"] },
        desfijar: { fn: (args, chat) => desfijar(args[0], chat), roles: ["admin"] }
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

    const rol = salas[chatId].administradores.includes(ip) ? "admin" : "user";
    
    const cmd = comandos[nombreComando];
    if (!cmd) return propiedadesMensaje;

    if (!cmd.roles.includes(rol)) return propiedadesMensaje;

    propiedadesMensaje = await cmd.fn(argumentos, chatActual)

    return propiedadesMensaje
}
