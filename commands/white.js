import fs from "fs";

export default {
    name: "white",
    description: "Un comando para whitear a un usuario",
    roles: ["admin"],
    execute: async ({ args, chatId, salas }) => {
        const ip = args[0]
        if (!salas[chatId].whitelist.includes(ip)) salas[chatId].whitelist.push(ip);
        fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));
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
