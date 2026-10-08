import express, { urlencoded } from "express";
import type { Application } from "express";
import { APP_PORT } from "./configs/env.config.js";
import errorHandler, {
	routeNotFoundHandler,
} from "./middlewares/error-handler.middleware.js";
import apiRouter from "./router/api.router.js";
import cors from "cors";
import { CLIENT_ORIGIN } from "./configs/env.config.js";
import { createServer, Server } from "http";
import configureSocket from "./configs/socket.config.js";

const app: Application = express();

const httpServer: Server = createServer(app);

configureSocket(httpServer);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
	cors({
		origin: CLIENT_ORIGIN,
		credentials: true,
	}),
);

app.use("/api", apiRouter);

app.use(routeNotFoundHandler);

app.use(errorHandler);

httpServer.listen(APP_PORT, () => {
	console.log(`Server is running on port ${APP_PORT}`);
});

export default app;
