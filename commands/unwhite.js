import fs from "fs";

export async function unwhite(ip, chatId) {
    const salas = JSON.parse(fs.readFileSync("./listas/salas.json"));
    const chat = salas[chatId]

    const idx = chat.whitelist.indexOf(ip);
    if (idx > -1) chat.whitelist.splice(idx, 1);

    fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido deswhislisteado`
    } };
}
