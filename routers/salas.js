import { Router } from "express";
import Mods from "../classes/Mods.js";
import path from "path";
import { pathToFileURL } from "url"

const mods = Mods.buscarMods()
const modsArray = Object.values(mods)

let enviarChat, recibirMensaje, enviarInfoSalas

if (modsArray.some(e => e.controllerChat)) {
    const mod = modsArray.find(e => e.controllerChat)

    const chatPath = path.join(process.cwd(), mod.directorio, "controllers", "chat.js")
    const chatModule = await import(pathToFileURL(chatPath).href)

    ;({ enviarChat, recibirMensaje, enviarInfoSalas } = chatModule)
} else {
    const chatPath = path.join(process.cwd(), "controllers", "chat.js")
    const chatModule = await import(pathToFileURL(chatPath).href)

    ;({ enviarChat, recibirMensaje, enviarInfoSalas } = chatModule)
}

export const salasRouter = Router({ mergeParams: true })

salasRouter.get("/", enviarInfoSalas)
salasRouter.get("/:chatId", enviarChat)
salasRouter.post("/:chatId", recibirMensaje)