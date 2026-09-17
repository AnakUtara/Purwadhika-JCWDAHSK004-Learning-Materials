import { APP_NAME, OPENROUTER_API_KEY } from "../configs/env.config.js";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openRouter = createOpenRouter({
	apiKey: OPENROUTER_API_KEY,
});
export default openRouter;
