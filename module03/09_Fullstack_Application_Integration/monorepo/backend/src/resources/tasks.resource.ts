import { Router } from "express";
import TasksController from "../controllers/tasks.controller.js";
import { requestBodyValidation } from "../middlewares/request-body-validation.middleware.js";
import {
	createTaskSchema,
	updateTaskSchema,
} from "../validations/task.schema.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const tasksResource = Router();

tasksResource.get("/", TasksController.getAll);
tasksResource.get("/:id", TasksController.getById);
tasksResource.post(
	"/",
	authenticate,
	requestBodyValidation(createTaskSchema),
	TasksController.create,
);
tasksResource.patch("/:id", authenticate, TasksController.restore);
tasksResource.put(
	"/:id",
	authenticate,
	requestBodyValidation(updateTaskSchema),
	TasksController.update,
); // update data
tasksResource.delete("/:id", authenticate, TasksController.delete); // hard delete

export default tasksResource;
