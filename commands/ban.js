import fs from "fs";
import blacklist from "../data/blacklist.json" with { type: "json" };
import whitelist from "../data/whitelist.json" with { type: "json" };

export async function ban(ip) {
    blacklist.push(ip)

    fs.writeFileSync("./data/blacklist.json", JSON.stringify(blacklist))
    
    const idx = whitelist.indexOf(ip)

    if (idx > -1) {
        whitelist.splice(idx, 1)
    }

    fs.writeFileSync("./data/whitelist.json", JSON.stringify(whitelist))

    return { mostrar: true, mensajeSistema: {} }
}
