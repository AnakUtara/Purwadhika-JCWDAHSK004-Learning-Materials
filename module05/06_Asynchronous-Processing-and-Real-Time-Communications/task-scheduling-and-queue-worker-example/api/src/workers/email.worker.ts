import { Worker } from "bullmq";
import { signUpEmailNotificationJob } from "./jobs/email.job.ts";
import { redisQueue } from "../libs/redis.ts";
import logger from "../utils/logger.ts";

const emailWorker = new Worker(
	"email-queue",
	async (job) => {
		switch (job.name) {
			case "sign-up-email-notification":
				signUpEmailNotificationJob(job.data);
				break;
			default:
				console.warn(`Unknown job name: ${job.name}`);
		}
	},
	{ connection: redisQueue },
);

emailWorker.on("active", (job) => {
	console.log(`Job ${job.id} is processing!`);
});

emailWorker.on("completed", (job) => {
	console.log(`Job ${job.id} completed!`);
});

emailWorker.on("failed", (job, err) => {
	logger.error(`❌ Job ${job?.id} failed: ${err.message}`, {
		jobId: job?.id,
		error: err,
	});
	console.log(`❌ Job ${job?.id} failed: ${err.message}`);
});

export default emailWorker;
