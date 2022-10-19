import * as mongoose from "mongoose";
import Location from "./location.interface";

const locationSchema = new mongoose.Schema<Location>({
	submittedBy: {
		ref: "User",
		type: mongoose.Schema.Types.ObjectId
	},
	position: {
		lat: Number,
		lng: Number
	},
	facilities: [String],
	savedBy: [
		{
			ref: "User",
			type: mongoose.Schema.Types.ObjectId
		}
	],
	description: String
	// rating: Number
});

locationSchema.pre("find", function (next) {
	this.populate("submittedBy").populate("savedBy");
	next();
});

const locationModel = mongoose.model<Location & mongoose.Document>(
	"Location",
	locationSchema
);

export default locationModel;
