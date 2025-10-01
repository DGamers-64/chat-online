import Archivos from "../classes/Archivos.js";

export default {
    name: "white",
    description: "Un comando para whitear a un usuario",
    roles: ["admin"],
    execute: async ({ args, chatId, salas }) => {
        const ip = args[0]
        if (!salas[chatId].whitelist.includes(ip)) salas[chatId].whitelist.push(ip);
        Archivos.escribirSalas(salas)
        return {
            mostrar: true,
            mensajeSistema: {
                timestamp: Date.now(),
                usuario: "SISTEMA",
                mensaje: `${ip} ha sido whitelisteado`
            }
        };
    }
};
