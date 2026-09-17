import { Router } from "express";
import SessionController from "../controllers/session.controller.js";

const sessionsRouter = Router();

sessionsRouter.get("/", SessionController.getAll);
sessionsRouter.post("/", SessionController.create);
sessionsRouter.get("/:id", SessionController.getById);

sessionsRouter.get("/:id/messages", SessionController.getMessagesBySessionId);
sessionsRouter.post("/:id/messages", SessionController.addMessages);

export default sessionsRouter;
