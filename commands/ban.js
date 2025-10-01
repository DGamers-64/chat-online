import Archivos from "../classes/Archivos";

export default {
    name: "ban",
    description: "Un comando para banear a un usuario",
    roles: ["admin"],
    execute: async ({ args, chatId, salas }) => {
        const ip = args[0]
        if (!salas[chatId].blacklist.includes(ip)) salas[chatId].blacklist.push(ip);
        Archivos.escribirSalas(salas)
        return {
            mostrar: true,
            mensajeSistema: {
                timestamp: Date.now(),
                usuario: "SISTEMA",
                mensaje: `${ip} ha sido baneado`
            }
        };
    }
};
