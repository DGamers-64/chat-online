import fs from "fs";

export async function white(ip) {
    const whitelist = JSON.parse(fs.readFileSync("./listas/whitelist.json"));

    if (!whitelist.includes(ip)) whitelist.push(ip);

    fs.writeFileSync("./listas/whitelist.json", JSON.stringify(whitelist, null, 4));

    return { mostrar: false, mensajeSistema: {
        mensaje: `${ip} ha sido añadido a la lista blanca`
    } };
}
