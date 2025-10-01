import express, { json } from 'express'
import { logger } from "./middlewares/log.js";
import { styleText } from "node:util";
import { banlist } from './middlewares/banlist.js';
import { nombresRouter } from './routers/nombre.js';
import { salasRouter } from './routers/salas.js';
import Mods from './classes/Mods.js';
import path from 'node:path';

const PORT = process.env.PORT
const app = express()

app.disable('x-powered-by')
app.use(json())

app.use(banlist)
app.use(logger)
const mods = Mods.buscarMods()
const modsArray = Object.values(mods)
if (modsArray.some(e => e.client)) {
    const mod = modsArray.find(e => e.client)
    app.use(express.static(path.join(mod.directorio, "public")))
} else {
    app.use(express.static('public'))
}

app.use("/nombre", nombresRouter)
app.use("/salas", salasRouter)

app.use((req, res) => { res.status(404).send('<h1>Error 404</h1>') })

app.listen(PORT, () => {
    let mods = Mods.buscarMods()
    mods = Object.keys(mods).join(", ")

    const texto = [
        "--------------------------------------------",
        "           CHAT ONLINE EN NODEJS            ",
        "--------------------------------------------",
        `PUBLICO: ${process.env.PUBLICO}             `,
        `PREFIJO: ${process.env.PREFIJO}             `,
        `MODS CARGADOS: ${mods}`,
        "--------------------------------------------",
        `Servidor encendido en el puerto ${PORT}     `,
        `Cliente alojado en http://localhost:${PORT} `,
        "--------------------------------------------",
    ].join("\n")

    console.log(styleText("cyan", texto))
})