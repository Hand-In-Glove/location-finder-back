import { Request } from "express";
import { User } from "../resources/User";

interface RequestWithUser extends Request {
	user: User;
}

export default RequestWithUser;
