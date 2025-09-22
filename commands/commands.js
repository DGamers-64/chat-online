import { cls } from "./cls.js";
import { dados } from "./dados.js";
import { ayuda } from "./ayuda.js";
import { ban } from "./ban.js";
import { unban } from "./unban.js";
import administradores from "../data/administradores.json" with { type: "json" };

export async function comprobarMensaje(mensaje, ip) {
    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {            
            id: global.id,
            timestamp: Date.now(),
            usuario: `SISTEMA`,
        }
    }

    const prefijo = process.env.PREFIJO || "/";
    if (!mensaje.mensaje.startsWith(prefijo)) return { mostrar: true, mensajeSistema: {} };
    
    let comando = mensaje.mensaje.slice(prefijo.length).trim().split(" ");
    
    if (administradores.includes(ip)) {
        switch (comando[0]) {
            case "ban":
                propiedadesMensaje = ban(comando[1])
                break;
            
            case "unban":
                propiedadesMensaje = unban(comando[1])
                break;
        
            default:
                break;
        }
    }

    switch (comando[0]) {
        case "cls":
            propiedadesMensaje = cls()
            break;
            
        case "dados":
            propiedadesMensaje = dados(comando[1])
            break;

        case "ayuda":
            propiedadesMensaje = ayuda()
            break;

        default:
            break;
    }

    return propiedadesMensaje
}