import { cls } from "./cls.js";
import { dados } from "./dados.js";
import { ayuda } from "./ayuda.js";

export function comprobarMensaje(mensaje) {
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