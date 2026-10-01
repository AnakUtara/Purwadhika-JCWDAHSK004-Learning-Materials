import "dotenv/config";

const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || "0.0.0.0";

const DB_URL =
	process.env.DATABASE_URL ||
	"postgresql://user:password@service_name:5432/mydb?schema=public";

export { APP_PORT, APP_HOST, DB_URL };
