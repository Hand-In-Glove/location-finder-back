import Location from "resources/Location/location.interface";

type UserRole = "user" | "admin";

interface User {
	_id: string;
	firstName?: string;
	lastName?: string;
	userName: string;
	email: string;
	password: string;
	submittedLocations: Location[];
	savedLocations: Location[];
	role: UserRole;
}

export default User;
