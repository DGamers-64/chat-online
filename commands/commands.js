import { cls } from "./cls.js";
import { dados } from "./dados.js";
import { ayuda } from "./ayuda.js";
import { cerrar } from "./cerrar.js";

export function comprobarMensaje(mensaje, chat, nombres, id) {
    let propiedadesMensaje = {
        mostrar: true,
        mensajeSistema: {            
            id: id,
            timestamp: Date.now(),
            usuario: `SISTEMA`,
        }
    }

    const prefijo = process.env.PREFIJO || "/";
    if (!mensaje.mensaje.startsWith(prefijo)) return { mostrar: true, mensajeSistema: {} };

    let comando = mensaje.mensaje.slice(prefijo.length).trim().split(" ");

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

        case "cerrar":
            propiedadesMensaje = cerrar()
            break;

        default:
            break;
    }

    return propiedadesMensaje
}