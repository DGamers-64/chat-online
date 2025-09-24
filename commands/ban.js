import fs from "fs";

export async function ban(ip) {
    const blacklist = JSON.parse(fs.readFileSync("./listas/blacklist.json"));

    if (!blacklist.includes(ip)) blacklist.push(ip);

    fs.writeFileSync("./listas/whitelist.json", JSON.stringify(whitelist, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido baneado`
    } };
}
