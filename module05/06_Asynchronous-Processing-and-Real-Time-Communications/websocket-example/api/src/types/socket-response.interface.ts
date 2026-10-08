export interface SocketResponse {
	status: "ok" | "error";
	message?: string;
	errors?: any;
}
