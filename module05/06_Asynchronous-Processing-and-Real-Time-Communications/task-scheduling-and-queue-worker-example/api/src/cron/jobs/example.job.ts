import { createScheduler } from "../runner.ts";

export const every5Minutes = () => {
	createScheduler("*/5 * * * *", () => {
		console.log("running a task every 5 minutes");
	});
};
