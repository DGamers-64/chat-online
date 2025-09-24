import fs from "fs";

export async function ban(ip, chatId) {
    const salas = JSON.parse(fs.readFileSync("./listas/salas.json"));
    const chat = salas[chatId]

    if (!chat.blacklist.includes(ip)) chat.blacklist.push(ip);

    fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido baneado`
    } };
}
