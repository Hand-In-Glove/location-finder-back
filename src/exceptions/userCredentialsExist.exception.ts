import HttpException from "./http.exception";

export default class UserWithCredentialsAlreadyExists extends HttpException {
	constructor(public type: string, public credentials: string) {
		super(
			400,
			`User with those credentials already exists. ${type}: ${credentials}`
		);
	}
}
