import fs from "fs";

export async function unban(ip) {
    const whitelist = JSON.parse(fs.readFileSync("./listas/whitelist.json", "utf-8"));
    const blacklist = JSON.parse(fs.readFileSync("./listas/blacklist.json", "utf-8"));

    if (!whitelist.includes(ip)) whitelist.push(ip);

    const idx = blacklist.indexOf(ip);
    if (idx > -1) blacklist.splice(idx, 1);

    fs.writeFileSync("./listas/whitelist.json", JSON.stringify(whitelist, null, 2));
    fs.writeFileSync("./listas/blacklist.json", JSON.stringify(blacklist, null, 2));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido desbaneado`
    } };
}
