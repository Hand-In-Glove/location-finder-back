import WrongCredentialsException from "../../exceptions/wrongCredentials.exception";
import { NextFunction, Request, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import CreateUserDto from "../User/createUser.dto";
import userModel from "../User/user.model";
import AuthService from "./auth.service";
import LoginDto from "./login.dto";

const COOKIE_NAME = process.env.COOKIE_NAME;

class AuthController implements Controller {
	public path = "/auth";
	public router = Router();
	private authService = new AuthService();
	private user = userModel;

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/signup`, this.signup);
		this.router.post(`${this.path}/login`, this.login);
		this.router.get(`${this.path}/logout`, this.logout);
	}

	private signup = async (req: Request, res: Response, next: NextFunction) => {
		const signupData: CreateUserDto = req.body;
		try {
			const { cookie, user } = await this.authService.register(signupData);
			res.setHeader("Set-Cookie", [cookie]);
			res.send(user);
		} catch (error) {
			next(error);
		}
	};

	private login = async (req: Request, res: Response, next: NextFunction) => {
		const loginData: LoginDto = req.body;
		const foundUser = await this.user.findOne({ email: loginData.email });
		if (foundUser) {
			const isValidPassword = await this.authService.validatePassword(
				loginData.password,
				foundUser.get("password", null, { getters: false })
			);
			if (isValidPassword) {
				const tokenData = this.authService.createToken(foundUser);
				const cookie = this.authService.createCookie(tokenData);
				res.setHeader("Set-Cookie", [cookie]);
				res.send(foundUser);
			} else {
				next(new WrongCredentialsException());
			}
		} else {
			next(new WrongCredentialsException());
		}
	};

	private logout = (req: Request, res: Response) => {
		// res.clearCookie(COOKIE_NAME, { sameSite: "strict" });
		res.setHeader(
			"Set-Cookie",
			`${COOKIE_NAME}=; HttpOnly; Max-Age=0;SameSite=Strict`
		);
		res.status(200).json({ message: "logout success" });
	};
}

export default AuthController;
