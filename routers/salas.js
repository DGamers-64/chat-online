import { Router } from "express";
import { enviarChat, recibirMensaje, enviarInfoSalas } from "../controllers/chat.js";

export const salasRouter = Router({ mergeParams: true })

salasRouter.get("/", enviarInfoSalas)
salasRouter.get("/:chatId", enviarChat)
salasRouter.post("/:chatId", recibirMensaje)