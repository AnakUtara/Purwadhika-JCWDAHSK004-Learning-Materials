import { Queue } from "bullmq";
import { redisQueue } from "../libs/redis.ts";

export const emailQueue = new Queue("email-queue", {
	connection: redisQueue,
});
