import ResourceNotFoundException from "exceptions/resourceNotFound.exception";
import { NextFunction, Request, response, Response, Router } from "express";
import Controller from "interfaces/controller.interface";
import RequestWithUser from "interfaces/requestWithUser.interface";
import userModel from "./user.model";

class UserController implements Controller {
	public path = "/users";
	public router = Router();
	private user = userModel;

	controller() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}/:id`, this.getById);
	}

	private async getById(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		const user = await this.user.findById(id);
		if (user) {
			response.send(user);
		} else {
			next(new ResourceNotFoundException("user"));
		}
	}
}

export default UserController;
