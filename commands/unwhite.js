import Archivos from "../classes/Archivos";

export default {
    name: "unwhite",
    description: "Un comando para deswhitear a un usuario",
    roles: ["admin"],
    execute: async ({ args, chatId, salas }) => {
        const ip = args[0]
        const idx = salas[chatId].whitelist.indexOf(ip);
        if (idx > -1) salas[chatId].whitelist.splice(idx, 1);

        Archivos.escribirSalas(salas)

        return {
            mostrar: true,
            mensajeSistema: {
                timestamp: Date.now(),
                usuario: "SISTEMA",
                mensaje: `${ip} ha sido deswhiteado`
            }
        };
    }
};
