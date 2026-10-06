import { Router } from "express";
import PostsController from "../modules/posts/posts.controller.ts";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.ts";
import requestValidator from "../middlewares/request-validator.middleware.ts";
import { createPostSchema } from "../validators/posts.validator.ts";

const postsRouter: Router = Router();

postsRouter.get("/", PostsController.getAll);
postsRouter.get("/:id", PostsController.getById);

postsRouter.use(verifyToken("access"), roleGuard("EDITOR"));

postsRouter.get("/me", PostsController.getAllByAuthor);
postsRouter.post(
	"/",
	requestValidator(createPostSchema, "body"),
	PostsController.create,
);
postsRouter.put("/:id", PostsController.update);
postsRouter.patch("/:id", PostsController.restore);
postsRouter.delete("/:id", PostsController.delete);

export default postsRouter;
