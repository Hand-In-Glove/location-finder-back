import HttpException from "./http.exception";

class ResourceNotFoundException extends HttpException {
	constructor(resource: string) {
		super(404, `Could not find ${resource} data`);
	}
}

export default ResourceNotFoundException;
