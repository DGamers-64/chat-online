import express, { json } from 'express'
import { logger } from "./middlewares/log.js";
import { styleText } from "node:util";
import { banlist } from './middlewares/banlist.js';
import { nombresRouter } from './routers/nombre.js';
import { salasRouter } from './routers/salas.js';

const PORT = process.env.PORT
const app = express()

app.disable('x-powered-by')
app.use(json())

app.use(banlist)
app.use(logger)
app.use(express.static('public'))

app.use("/nombre", nombresRouter)
app.use("/salas", salasRouter)

app.use((req, res) => { res.status(404).send('<h1>Error 404</h1>') })

app.listen(PORT, () => {
    const texto = [
        "--------------------------------------------",
        "           CHAT ONLINE EN NODEJS            ",
        "--------------------------------------------",
        `PUBLICO: ${process.env.PUBLICO}             `,
        `PREFIJO: ${process.env.PREFIJO}             `,
        "--------------------------------------------",
        `Servidor encendido en el puerto ${PORT}     `,
        `Cliente alojado en http://localhost:${PORT} `,
        "--------------------------------------------",
    ].join("\n")

    console.log(styleText("cyan", texto))
})