import Archivos from "../classes/Archivos";

export default {
    name: "unban",
    description: "Un comando para desbanear a un usuario",
    roles: ["admin"],
    execute: async ({ args, chatId, salas }) => {
        const ip = args[0]
        const idx = salas[chatId].blacklist.indexOf(ip);
        if (idx > -1) salas[chatId].blacklist.splice(idx, 1);

        Archivos.escribirSalas(salas)

        return {
            mostrar: true,
            mensajeSistema: {
                timestamp: Date.now(),
                usuario: "SISTEMA",
                mensaje: `${ip} ha sido desbaneado`
            }
        };
    }
};
