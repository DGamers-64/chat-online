export default class Mods {
    static buscarMods() {
        return JSON.parse(fs.readFileSync("./listas/mods.json"));
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