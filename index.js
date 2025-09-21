import express, { json } from 'express'
import { mandarMensaje } from "./functions/mandarMensaje.js";
import { limpiarIP } from "./functions/limpiarIP.js";
import { logger } from "./functions/logger.js";
import { styleText } from "node:util";

const PORT = process.env.PORT
const app = express()
global.nombres = {}
global.chat = []
global.id = 0

app.disable('x-powered-by')
app.use(json())


app.use(express.static('public'))

app.post("/nombre", (req, res) => {
    global.nombres[limpiarIP(req.socket.remoteAddress)] = req.body.nombre
    
    logger(`${styleText("yellow", "NOMBRE CAMBIADO")}: ${limpiarIP(req.socket.remoteAddress)} => ${req.body.nombre}`)

    res.send()
})

app.post("/chat", (req, res) => { mandarMensaje(req, res) })

app.get("/chat", (req, res) => {
    let chatAEnviar = global.chat.filter(e => e.id >= req.query.id)

    res.send(chatAEnviar)
})

app.use((req, res) => {
    res.status(404).send('<h1>Error 404</h1>')
})

app.listen(PORT, () => {
    console.log(styleText("cyan", '--------------------------------------------'))
    console.log(styleText("cyan", '           CHAT ONLINE EN NODEJS'))
    console.log(styleText("cyan", '--------------------------------------------'))
    console.log(styleText("cyan", `Servidor encendido en el puerto ${PORT}`))
    console.log(styleText("cyan", `Cliente alojado en http://localhost:${PORT}`))
    console.log(styleText("cyan", '--------------------------------------------'))
})