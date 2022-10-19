import { Request, Response } from "express";
export default function loggerMiddleware(
	request: Request,
	response: Response,
	next
) {
	console.log(`${request.method} / ${request.path} `);
	next();
}
