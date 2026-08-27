interface IResponse<T> {
	message: string;
	data: T;
	meta: {
		currentPage: number;
		limit: number;
		totalPages: number;
		totalItems: number;
	};
}

export type { IResponse };
