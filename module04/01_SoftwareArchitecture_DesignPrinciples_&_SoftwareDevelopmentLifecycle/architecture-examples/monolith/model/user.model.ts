class User {
	id: number;
	email: string;
	password: string;
	avatarUrl: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;

	constructor(
		id: number,
		email: string,
		password: string,
		avatarUrl: string,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date,
	) {
		this.id = id;
		this.email = email;
		this.password = password;
		this.avatarUrl = avatarUrl;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.deletedAt = deletedAt;
	}
}
