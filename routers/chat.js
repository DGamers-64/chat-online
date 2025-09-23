import { Router } from "express";
import { enviarChat, recibirMensaje } from "../controllers/chat.js";

export const chatRouter = Router({ mergeParams: true })

chatRouter.get("/", enviarChat)
chatRouter.post("/", recibirMensaje)