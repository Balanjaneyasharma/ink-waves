export class HttpError extends  Error {
	status: number;

	constructor(message: string, status = 500) {
		super(message);
		this.status = status ?? 500;
	}

}