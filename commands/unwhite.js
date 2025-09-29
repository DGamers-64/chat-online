import fs from "fs";

export default {
    name: "unwhite",
    description: "Un comando para deswhitear a un usuario",
    roles: ["admin"],
    execute: async ({ args, chatId, salas }) => {
        const ip = args[0]
        const idx = salas[chatId].whitelist.indexOf(ip);
        if (idx > -1) salas[chatId].whitelist.splice(idx, 1);

        fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));

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
