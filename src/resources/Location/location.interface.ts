import User from "resources/User/user.interface";

interface Location {
	_id: string;
	position: {
		lat: number;
		lng: number;
	};
	submittedBy: User;
	facilities: string[];
	savedBy: User[];
	// rating: number;
	imageUrl: string;
	description: string;
}

export default Location;
