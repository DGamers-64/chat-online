import fs from "fs";
import { limpiarIP } from "../functions/limpiarIP.js";
import { styleText } from "node:util";

export function addNombre(req, res) {
    const nombres = JSON.parse(fs.readFileSync("./listas/nombres.json", "utf-8"));

    nombres[limpiarIP(req.socket.remoteAddress)] = req.body.nombre

    fs.writeFileSync("./listas/nombres.json", JSON.stringify(nombres, null, 4));
    
    console.log(`${styleText("yellow", "NOMBRE CAMBIADO")}: ${limpiarIP(req.socket.remoteAddress)} => ${req.body.nombre}`)

    res.send()
}