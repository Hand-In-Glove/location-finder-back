import { NextFunction, Request, response, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import locationModel from "./location.model";
import { withAuth } from "../../middleware";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import ResourceNotFoundException from "../../exceptions/resourceNotFound.exception";
import LocationService from "./location.service";
import CreateLocationDto from "./createLocation.dto";
import Location from "./location.interface";

class LocationController implements Controller {
	public path: string = "/locations";
	public router: Router = Router();
	private location = locationModel;
	// private locationService = new LocationService();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}/:id`, this.getLocationById);
		this.router.post(this.path, withAuth, this.createLocation);
		this.router
			.all(`${this.path}/*`, withAuth)
			.patch(`${this.path}/:id`, this.modifyLocation);
	}

	private createLocation = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		const { user } = req;
		const locationData: CreateLocationDto = req.body;
		const createdLocation = await this.location.create({
			...locationData,
			submittedBy: user._id
		});

		createdLocation.populate("submittedBy", "-password");
		res.send(createdLocation);
	};

	private getLocationById = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { id } = req.params;
		const location = await this.location.findById(id).exec();
		if (location) {
			res.send(location);
		} else {
			next(new ResourceNotFoundException("location"));
		}
	};

	private modifyLocation = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		const { id } = req.params;
		const locationData: Location = req.body;
		const location = await this.location.findByIdAndUpdate(id, locationData, {
			new: true
		});
		if (location) {
			response.send(location);
		} else {
			next(new ResourceNotFoundException("location"));
		}
	};

	private getLocationInRange() {}
}

export default LocationController;
