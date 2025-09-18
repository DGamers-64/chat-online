import express, { json } from 'express'

const PORT = process.env.PORT
const app = express()
const nombres = {}
const chat = []

app.disable('x-powered-by')
app.use(json())
app.use(express.static('public'))

// app.use(MiddlewaresAPI.accessLog) // MIDDLEWARE

// app.use('/ykw2', ykw2Router) // ROUTER

app.post("/nombre", (req, res) => {
    nombres[limpiarIP(req.socket.remoteAddress)] = req.body.nombre

    res.send()
})

app.post("/chat", (req, res) => {
    let nombreUsuario
    if (!nombres[limpiarIP(req.socket.remoteAddress)]) {
        nombreUsuario = limpiarIP(req.socket.remoteAddress)
    } else {
        nombreUsuario = nombres[limpiarIP(req.socket.remoteAddress)]
    }

    chat.push({
        timestamp: Date.now(),
        usuario: `${nombreUsuario} (${limpiarIP(req.socket.remoteAddress)})`,
        mensaje: req.body.mensaje
    })

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
    }
    return ip
}