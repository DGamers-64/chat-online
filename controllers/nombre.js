import Utils from "../classes/Utils.js";
import { styleText } from "node:util";
import Archivos from "../classes/Archivos.js";

export function addNombre(req, res) {
    const ip = Utils.limpiarIP(req.socket.remoteAddress)
    const nombres = Archivos.devolverNombres()

    nombres[ip] = req.body.nombre

    Archivos.escribirNombres(nombres)
    
    console.log(`${styleText("yellow", "NOMBRE CAMBIADO")}: ${ip} => ${req.body.nombre}`)

    res.send()
}

export function getNombre(req, res) {
    const ip = Utils.limpiarIP(req.socket.remoteAddress)
    const nombres = Archivos.devolverNombres()
    
    if (nombres[ip]) {
        const nombre = nombres[ip]

        res.json([nombre])
    } else {
        res.json([ip])
    }

}