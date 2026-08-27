import { Router } from "express";
import PostsController from "../controllers/posts.controller.js";
import { requestBodyValidation } from "../middlewares/request-body-validation.middleware.js";
import {
	createPostSchema,
	updatePostSchema,
} from "../validations/post.schema.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const postsResource = Router();

postsResource.get("/", PostsController.getAll);
postsResource.get("/:id", PostsController.getById);
postsResource.post(
	"/",
	authenticate,
	requestBodyValidation(createPostSchema),
	PostsController.create,
);
postsResource.patch("/:id", authenticate, PostsController.restore);
postsResource.put(
	"/:id",
	authenticate,
	requestBodyValidation(updatePostSchema),
	PostsController.update,
); // update data
postsResource.delete("/:id", authenticate, PostsController.delete); // hard delete

export default postsResource;
