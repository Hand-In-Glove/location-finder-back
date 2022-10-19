import * as express from "express";
import { Application } from "express";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import mongoose from "mongoose";

import { logger, withAuth, errorHandler } from "./middleware";
import Controller from "interfaces/controller.interface";

class App {
	public app: Application;
	public port: number;

	constructor(controllers, port) {
		this.app = express();
		this.port = port;

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeLogging();
		this.initializeControllers(controllers);
		this.initializeErrorHandler();
	}

	private initializeMiddlewares() {
		this.app.use(
			cors({
				origin: "http://localhost:4200",
				allowedHeaders: ["Content-Type", "Authorization"],
				credentials: true
			})
		);
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	}

	private initializeControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.app.use("/", controller.router);
		});
	}

	private initializeErrorHandler() {
		this.app.use(errorHandler);
	}

	private initializeLogging() {
		this.app.use(logger);
	}

	private connectToDatabase() {
		try {
			mongoose.connect(process.env.MONGO_URI, (error) => {
				if (error) throw new Error(error.message);
				console.log("Database connected 🌈");
			});
		} catch (error) {
			console.error(`DB ERROR: \n${error}`);
		}
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`Listening and live on ${this.port} 🦄`);
		});
	}
}

export default App;
