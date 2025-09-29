import fs from "fs";

export default {
    name: "ban",
    description: "Un comando para banear a un usuario",
    roles: ["admin"],
    execute: async ({ args, chatId, salas }) => {
        const ip = args[0]
        if (!salas[chatId].blacklist.includes(ip)) salas[chatId].blacklist.push(ip);
        fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));
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
