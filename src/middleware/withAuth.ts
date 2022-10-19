import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";

import JwtPayload from "interfaces/jwtPayload.interface";
import RequestWithUser from "interfaces/requestWithUser.interface";
import { userModel } from "../resources/User";
import AuthenticationTokenMissingException from "../exceptions/authTokenMissing.exception";
import InvalidAuthTokenException from "../exceptions/invalidToken.exception";

const cookieName = process.env.COOKIE_NAME;

async function withAuth(
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) {
	const cookies = req.cookies;
	if (cookies && cookies[cookieName]) {
		const secret = process.env.JWT_SECRET;
		try {
			const verificationResponse = jwt.verify(
				cookies[cookieName],
				secret
			) as jwt.JwtPayload & JwtPayload;
			const id = verificationResponse._id;
			const user = await userModel.findById(id);
			if (user) {
				req.user = user;
				next();
			} else {
				next(new InvalidAuthTokenException());
			}
		} catch (error) {
			next(new InvalidAuthTokenException());
		}
	} else {
		next(new AuthenticationTokenMissingException());
	}
}

export default withAuth;
