import { Router, type Request, type Response } from "express";
import { APP_NAME } from "../configs/env.config.js";
import postsResource from "../resources/posts.resource.js";
import tagsResource from "../resources/tags.resource.js";
import authResource from "../resources/auth.resource.js";
import tasksResource from "../resources/tasks.resource.js";

const apiRouter: Router = Router();

// Welcome endpoint
apiRouter.get("/", (_req: Request, res: Response) => {
	res.send({ message: `Welcome to the ${APP_NAME}!` });
});

apiRouter.use("/auth", authResource);
apiRouter.use("/posts", postsResource);
apiRouter.use("/tasks", tasksResource);
apiRouter.use("/tags", tagsResource);

export default apiRouter;
