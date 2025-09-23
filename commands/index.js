import { cls } from "./cls.js";
import { dados } from "./dados.js";
import { ayuda } from "./ayuda.js";
import { ban } from "./ban.js";
import { unban } from "./unban.js";
import administradores from "../listas/administradores.json" with { type: "json" };

export async function comprobarMensaje(mensaje, ip) {
    const comandos = {
        cls: { fn: () => cls(), roles: ["user", "admin"] },
        dados: { fn: (args) => dados(args[0]), roles: ["user", "admin"] },
        ayuda: { fn: () => ayuda(), roles: ["user", "admin"] },
        ban: { fn: (args) => ban(args[0]), roles: ["admin"] },
        unban: { fn: (args) => unban(args[0]), roles: ["admin"] }
    };

    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {            
            id: global.id,
            timestamp: Date.now(),
            usuario: `SISTEMA`
        }
    }

    const prefijo = process.env.PREFIJO || "/";

    const partes = mensaje.mensaje.slice(prefijo.length).trim().split(/\s+/);
    const nombreComando = partes[0];
    const argumentos = partes.slice(1);

    const rol = administradores.includes(ip) ? "admin" : "user";
    
    const cmd = comandos[nombreComando];
    if (!cmd) return propiedadesMensaje;

    if (!cmd.roles.includes(rol)) return propiedadesMensaje;

    propiedadesMensaje = cmd.fn(argumentos)

    return propiedadesMensaje
}