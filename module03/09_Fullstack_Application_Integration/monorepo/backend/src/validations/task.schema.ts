import Yup from "../libs/yup.js";

const createTaskSchema = Yup.object().shape({
	name: Yup.string()
		.min(3, "Task name must be at least 3 characters long")
		.max(100, "Task name must be at most 100 characters long")
		.required("Task name is required"),
});

const updateTaskSchema = Yup.object().shape({
	name: Yup.string()
		.min(3, "Task name must be at least 3 characters long")
		.max(100, "Task name must be at most 100 characters long")
		.optional(),
});

export { createTaskSchema, updateTaskSchema };
