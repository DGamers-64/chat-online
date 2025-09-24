import fs from "fs";

export async function unban(ip, chatId) {
    const salas = JSON.parse(fs.readFileSync("./listas/salas.json"));
    const chat = salas[chatId]

    const idx = chat.blacklist.indexOf(ip);
    if (idx > -1) chat.blacklist.splice(idx, 1);

    fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido desbaneado`
    } };
}
