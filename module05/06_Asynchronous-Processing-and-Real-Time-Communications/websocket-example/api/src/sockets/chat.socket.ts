import type { Server, Socket } from "socket.io";
import { chatMessageSchema } from "../validations/chat-message.schema.js";
import type { SocketResponse } from "../types/socket-response.interface.js";

interface IChatMessage {
	sender: string;
	content: string;
	timestamp: string;
}

const registerChatHandler = (io: Server, socket: Socket) => {
	socket.on(
		"message-sent",
		(data: IChatMessage, cb: (res: SocketResponse) => void) => {
			const validData = chatMessageSchema.safeParse(data);

			if (!validData.success) {
				cb({ status: "error", message: validData.error.message });
			}

			io.emit("message-received", { ...validData.data, id: socket.id });
			cb({ status: "ok", message: "Message sent successfully" });
		},
	);
};

export { registerChatHandler };
