import { User } from "resources/User";

export default class CreateLocationDto {
	position: {
		lat: number;
		lng: number;
	};
	// submittedBy: User["_id"];
	facilities: string[];
	imageUrl: string;
}
