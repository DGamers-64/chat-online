import { Router } from "express";
import { addNombre } from "../controllers/nombre.js";

export const nombresRouter = Router({ mergeParams: true })

nombresRouter.post('/', addNombre)