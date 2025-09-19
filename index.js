import express, { json } from 'express'
import colors from 'colors'

const PORT = process.env.PORT
const app = express()
let nombres = {}
let chat = []
let id = 0

app.disable('x-powered-by')
app.use(json())

// app.use(MiddlewaresAPI.accessLog) // MIDDLEWARE

// app.use('/ykw2', ykw2Router) // ROUTER


app.get("/", (req, res) => {
    if (!req.query.logged) {
        console.log(`${"CONEXIÓN NUEVA".green}: ${limpiarIP(req.socket.remoteAddress)} se ha conectado`)
    }
    res.sendFile("index.html", { root: "public" })
})

app.use(express.static('public'))

app.post("/nombre", (req, res) => {
    nombres[limpiarIP(req.socket.remoteAddress)] = req.body.nombre
    
    console.log(`${"NOMBRE CAMBIADO".red}: ${limpiarIP(req.socket.remoteAddress)} => ${req.body.nombre}`)

    res.send()
})

app.post("/chat", (req, res) => {
    let nombreUsuario
    if (!nombres[limpiarIP(req.socket.remoteAddress)]) {
        nombreUsuario = limpiarIP(req.socket.remoteAddress)
    } else {
        nombreUsuario = nombres[limpiarIP(req.socket.remoteAddress)]
    }

    const mensaje = {
        id: id,
        timestamp: Date.now(),
        usuario: `${nombreUsuario} (${limpiarIP(req.socket.remoteAddress)})`,
        mensaje: req.body.mensaje
    }

    id++

    chat.push(mensaje)

    if (mensaje.mensaje == "/cls") {
        chat = []
        nombres = []
        id = 0
    }

    console.log(`${"NUEVO MENSAJE".blue}: ${mensaje.id} ${mensaje.timestamp} ${mensaje.usuario} : ${mensaje.mensaje}`)

    res.send()
})

app.get("/chat", (req, res) => {
    res.send(chat)
})

app.use((req, res) => {
    res.status(404).send({ res: `Error 404: ${req.url}` })
})

app.listen(PORT, () => {
    console.log('--------------------------------------------')
    console.log(`Servidor encendido en el puerto ${PORT}`)
    console.log(`Cliente alojado en http://localhost:${PORT}`)
    console.log('--------------------------------------------')
})

function limpiarIP(ip) {
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    } else if (ip.startsWith("::1")) {
        ip = "127.0.0.1"
    }
    return ip
}