import fs from "fs";

export async function unban(ip) {
    const whitelist = JSON.parse(fs.readFileSync("./listas/whitelist.json", "utf-8"));

    const idx = whitelist.indexOf(ip);
    if (idx > -1) whitelist.splice(idx, 1);

    fs.writeFileSync("./listas/whitelist.json", JSON.stringify(whitelist, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido quitado de la lista blanca`
    } };
}
