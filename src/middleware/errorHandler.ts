import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";

function errorHandler(
	error: HttpException,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const status = error.status || 500;
	const message = `${error.message} 🔥` || "Something went wrong";
	console.log(`${status} / ${message}`);
	response.status(status).send({
		message,
		status
	});
}

export default errorHandler;
