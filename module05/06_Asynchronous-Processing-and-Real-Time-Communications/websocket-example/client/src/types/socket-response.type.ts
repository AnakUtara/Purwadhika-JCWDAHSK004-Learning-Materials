interface ISocketResponse {
	status: "ok" | "error";
	message?: string;
	errors?: unknown;
}

export type { ISocketResponse };
