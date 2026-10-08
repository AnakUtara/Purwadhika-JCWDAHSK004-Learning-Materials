import "dotenv/config";

const APP_NAME = process.env.APP_NAME || "websocket-api";
const APP_PORT = process.env.APP_PORT || 8000;
const APP_ENV = process.env.APP_ENV || "development";

const IS_PRODUCTION = APP_ENV === "production";

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL || "";

export {
	APP_NAME,
	APP_PORT,
	APP_ENV,
	IS_PRODUCTION,
	CLIENT_ORIGIN,
	UPSTASH_REDIS_URL,
};
