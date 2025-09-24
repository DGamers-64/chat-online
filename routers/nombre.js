import { Router } from "express";
import { addNombre, getNombre } from "../controllers/nombre.js";

export const nombresRouter = Router({ mergeParams: true })

nombresRouter.get('/', getNombre)
nombresRouter.post('/', addNombre)