import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { CLIENT_ORIGIN } from "./env.config.js";
import { registerChatHandler } from "../sockets/chat.socket.js";

let io: Server;

export const getIO = (): Server => {
	return io;
};

const configureSocket = (server: HttpServer) => {
	io = new Server(server, {
		cors: {
			origin: CLIENT_ORIGIN,
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("New client connected with id: " + socket.id);

		registerChatHandler(io, socket);

		socket.on("disconnect", () => {
			console.log("Client disconnected with id: " + socket.id);
		});
	});
};

export default configureSocket;
