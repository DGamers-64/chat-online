import express, { json } from 'express'
import { recibirMensaje } from "./functions/recibirMensaje.js";
import { limpiarIP } from "./functions/limpiarIP.js";
import { logger } from "./middlewares/log.js";
import { styleText } from "node:util";
import { banlist } from './middlewares/banlist.js';

const PORT = process.env.PORT
const app = express()
global.nombres = {}
global.chat = []
global.id = 0

app.disable('x-powered-by')
app.use(json())

app.use(banlist)
app.use(logger)
app.use(express.static('public'))

app.post("/nombre", (req, res) => {
    global.nombres[limpiarIP(req.socket.remoteAddress)] = req.body.nombre
    
    console.log(`${styleText("yellow", "NOMBRE CAMBIADO")}: ${limpiarIP(req.socket.remoteAddress)} => ${req.body.nombre}`)

    res.send()
})

app.post("/chat", recibirMensaje)

app.get("/chat", (req, res) => { res.send(global.chat.filter(e => e.id >= req.query.id)) })

app.use((req, res) => { res.status(404).send('<h1>Error 404</h1>') })

app.listen(PORT, () => {
    const texto = [
        "--------------------------------------------",
        "           CHAT ONLINE EN NODEJS            ",
        "--------------------------------------------",
        `PUBLICO: ${process.env.PUBLICO}`,
        "--------------------------------------------",
        `Servidor encendido en el puerto ${PORT}     `,
        `Cliente alojado en http://localhost:${PORT} `,
        "--------------------------------------------",
    ].join("\n")

    console.log(styleText("cyan", texto))
})