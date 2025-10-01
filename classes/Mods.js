import fs from "fs";

export default class Mods {
    static buscarMods() {
        const mods = JSON.parse(fs.readFileSync("./listas/mods.json"));
        return Object.fromEntries(
            Object.entries(mods).filter(([key, value]) => value.enabled)
        )
    }
    
    static buscarModEspecifico(clave) {
        const mods = this.buscarMods()
        return mods[clave] || {}
    }

    static hayMods() {
        const mods = this.buscarMods()
        return mods.length > 0
    }
}