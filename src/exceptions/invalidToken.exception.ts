import HttpException from "./http.exception";

class InvalidAuthTokenException extends HttpException {
	constructor() {
		super(401, "Invalid authentication token");
	}
}

export default InvalidAuthTokenException;
