import "dotenv/config";

const APP_NAME = process.env.APP_NAME || "API-name";
const APP_PORT = process.env.APP_PORT || "8001";
const CLIENT_ORIGIN_URL =
	process.env.CLIENT_ORIGIN_URL || "http://localhost:5173";

export { APP_NAME, APP_PORT, CLIENT_ORIGIN_URL };
