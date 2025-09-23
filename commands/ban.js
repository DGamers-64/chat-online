import fs from "fs";

export async function ban(ip) {
    const blacklist = JSON.parse(fs.readFileSync("./listas/blacklist.json"));
    const whitelist = JSON.parse(fs.readFileSync("./listas/whitelist.json"));

    if (!blacklist.includes(ip)) blacklist.push(ip);

    const idx = whitelist.indexOf(ip);
    if (idx > -1) whitelist.splice(idx, 1);

    fs.writeFileSync("./listas/blacklist.json", JSON.stringify(blacklist, null, 2));
    fs.writeFileSync("./listas/whitelist.json", JSON.stringify(whitelist, null, 2));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido baneado`
    } };
}
