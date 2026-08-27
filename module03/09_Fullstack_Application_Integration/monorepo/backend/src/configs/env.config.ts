import "dotenv/config";

const APP_NAME = process.env.APP_NAME || "API Name";
const APP_PORT = process.env.APP_PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Database connection env
const DB_URL = process.env.DATABASE_URL || "";
const DIRECT_URL = process.env.DIRECT_URL || "";

// JWT configuration
const JWT_SECRET =
	process.env.JWT_SECRET ||
	"default_jwt_secret_sha256_alphanumeric_string_for_development_only";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export {
	APP_NAME,
	APP_PORT,
	CLIENT_URL,
	DB_URL,
	DIRECT_URL,
	JWT_SECRET,
	JWT_EXPIRES_IN,
};
