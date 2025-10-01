import fs from "fs";

export default class Archivos {
    static devolverSalas() {
        return JSON.parse(fs.readFileSync("./listas/salas.json")) || {};
    }
    
    static devolverNombres() {
        return JSON.parse(fs.readFileSync("./listas/nombres.json")) || {};
    }
    
    static devolverAdministradores() {
        return JSON.parse(fs.readFileSync("./listas/administradores.json")) || [];
    }
    
    static devolverBlacklist() {
        return JSON.parse(fs.readFileSync("./listas/blacklist.json")) || [];
    }
    
    static devolverWhitelist() {
        return JSON.parse(fs.readFileSync("./listas/whitelist.json")) || [];
    }
    
    static devolverChat(sala) {
        const salas = this.devolverSalas()
        return JSON.parse(fs.readFileSync(salas[sala].archivo, "utf-8")) || [];
    }
    
    static escribirSalas(salas) {
        fs.writeFileSync("./listas/salas.json", JSON.stringify(salas, null, 4));
    }
    
    static escribirChat(sala, chat) {
        const salas = this.devolverSalas()
        fs.writeFileSync(salas[sala].archivo, JSON.stringify(chat, null, 4));
    }
    
    static escribirNombres(nombres) {
        fs.writeFileSync("./listas/nombres.json", JSON.stringify(nombres, null, 4));
    }
}