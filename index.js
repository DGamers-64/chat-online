import express, { json } from 'express'
import colors from 'colors'
import { limpiarIP } from "./functions/limpiarIP.js";
import { mandarMensaje } from "./functions/mandarMensaje.js";

const PORT = process.env.PORT
const app = express()
let nombres = {}
let chat = []
let id = 0

app.disable('x-powered-by')
app.use(json())

app.get("/", (req, res) => {
    if (!req.query.logged) {
        console.log(`${colors.green("CONEXIÓN NUEVA")}: ${limpiarIP(req.socket.remoteAddress)} se ha conectado`)
    }
    res.sendFile("index.html", { root: "public" })
})

app.use(express.static('public'))

app.post("/nombre", (req, res) => {
    nombres[limpiarIP(req.socket.remoteAddress)] = req.body.nombre
    
    console.log(`${colors.red("NOMBRE CAMBIADO")}: ${limpiarIP(req.socket.remoteAddress)} => ${req.body.nombre}`)

    res.send()
})

app.post("/chat", (req, res) => { mandarMensaje(req, res, nombres, chat, id) })

app.get("/chat", (req, res) => {
    res.send(chat)
})

app.use((req, res) => {
    res.status(404).send({ res: `Error 404: ${req.url}` })
})

app.listen(PORT, () => {
    console.log('--------------------------------------------')
    console.log('CHAT ONLINE EN NODEJS')
    console.log('--------------------------------------------')
    console.log(`Servidor encendido en el puerto ${PORT}`)
    console.log(`Cliente alojado en http://localhost:${PORT}`)
    console.log('--------------------------------------------')
})