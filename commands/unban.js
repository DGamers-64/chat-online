import fs from "fs";

export async function unban(ip) {
    const blacklist = JSON.parse(fs.readFileSync("./listas/blacklist.json", "utf-8"));

    const idx = blacklist.indexOf(ip);
    if (idx > -1) blacklist.splice(idx, 1);

    fs.writeFileSync("./listas/blacklist.json", JSON.stringify(blacklist, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido desbaneado`
    } };
}
