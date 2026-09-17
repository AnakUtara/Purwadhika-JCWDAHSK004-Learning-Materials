import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { OPENROUTER_API_KEY } from "../configs/env.config.js";

const openRouter = createOpenRouter({
	apiKey: OPENROUTER_API_KEY,
});

export default openRouter;
