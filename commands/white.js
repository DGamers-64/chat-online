import fs from "fs";

export async function white(ip, chatId) {
    const salas = JSON.parse(fs.readFileSync("./listas/salas.json"));
    const chat = salas[chatId]

    if (!chat.whitelist.includes(ip)) chat.whitelist.push(ip);

    fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido whitlisteado`
    } };
}
