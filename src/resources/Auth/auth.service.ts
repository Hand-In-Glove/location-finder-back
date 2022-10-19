import * as bcrypt from "bcrypt";
import UserWithCredentialsAlreadyExists from "../../exceptions/userCredentialsExist.exception";
import * as jwt from "jsonwebtoken";
import TokenData from "../../interfaces/tokenData.interface";
import { CreateUserDto, User, userModel } from "../User";

const COOKIE_NAME = process.env.COOKIE_NAME;

class AuthService {
	public user = userModel;

	public async register(userData: CreateUserDto) {
		if (await this.user.findOne({ email: userData.email })) {
			throw new UserWithCredentialsAlreadyExists("email", userData.email);
		}
		const foundUser = await this.user.findOne({ userName: userData.userName });

		if (foundUser) {
			throw new UserWithCredentialsAlreadyExists("username", userData.userName);
		}
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const user = await this.user.create({
			...userData,
			password: hashedPassword
		});
		const tokenData = this.createToken(user);
		const cookie = this.createCookie(tokenData);
		return {
			cookie,
			user
		};
	}

	public createToken(user: User) {
		const expiresIn = 60 * 60 * 3;
		const secret = process.env.JWT_SECRET;
		return {
			expiresIn,
			token: jwt.sign({ _id: user._id }, secret, { expiresIn })
		};
	}

	public createCookie(tokenData: TokenData) {
		return `${COOKIE_NAME}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=Strict`;
	}

	public async validatePassword(
		loginPassword: string,
		userPassword: User["password"]
	) {
		return bcrypt.compare(loginPassword, userPassword);
	}
}

export default AuthService;
