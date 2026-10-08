import cron, { type TaskFn } from "node-cron";
import { every5Minutes } from "./jobs/example.job.ts";

const cronRunner = () => {
	cron.schedule("* * * * *", () => {
		console.log("running a task every minute");
	});
	every5Minutes();
	/* 
    cron.schedule("* 1 * * *", () => {
        prisma.event.updateMany({
            where: {
                endsAt: {
                    lte: new Date()
                }
            },
            data: {
                status: "COMPLETED"
            }
        })
    })
    */
};

export default cronRunner;

export const createScheduler = (expr: string, task: string | TaskFn) => {
	cron.schedule(expr, task);
};
