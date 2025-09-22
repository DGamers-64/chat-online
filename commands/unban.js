import fs from "fs";
import blacklist from "../data/blacklist.json" with { type: "json" };
import whitelist from "../data/whitelist.json" with { type: "json" };

export async function unban(ip) {
    whitelist.push(ip)

    fs.writeFileSync("./data/whitelist.json", JSON.stringify(whitelist))
    
    const idx = blacklist.indexOf(ip)

    if (idx > -1) {
        blacklist.splice(idx, 1)
    }

    fs.writeFileSync("./data/blacklist.json", JSON.stringify(blacklist))

    return { mostrar: true, mensajeSistema: {} }
}
