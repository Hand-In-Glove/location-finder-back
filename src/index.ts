import LocationController from "./resources/Location/location.controller";
import App from "./app";
import AuthController from "./resources/Auth/auth.controller";

const app = new App([new AuthController(), new LocationController()], 3000);

app.listen();
