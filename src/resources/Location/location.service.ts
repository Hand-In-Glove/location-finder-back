import locationModel from "./location.model";

type UNIT = "KM" | "METRES" | "MILES";

class LocationService {
	private KM = 111;
	private METRES = 111 * 1000;
	private MILES = 69;

	private location = locationModel;

	public getLocationsInRange(
		position: { lat: number; lng: number },
		range: number,
		unit: UNIT
	) {
		const latRange = this.calculateLocationRange(position.lat, range, unit);
		const lngRange = this.calculateLocationRange(position.lng, range, unit);
		const locations = this.location
			.find({})
			.where("position.lat")
			.gte(latRange.min)
			.where("position.lat")
			.lte(latRange.max)
			.where("position.lng")
			.gte(lngRange.min)
			.where("position.lng")
			.lte(lngRange.max)
			.populate("savedBy")
			.populate("submittedBy")
			.exec();
	}

	public calculateLocationRange(
		decimalDegreeVal: number,
		range: number,
		unit: UNIT
	) {
		const decimalDegreeModifier = this[unit] / (range / 2);
		return {
			max: decimalDegreeVal + decimalDegreeModifier,
			min: decimalDegreeVal - decimalDegreeModifier
		};
	}
}

export default LocationService;
