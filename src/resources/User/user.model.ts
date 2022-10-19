import * as mongoose from "mongoose";
import User from "./user.interface";

const userSchema = new mongoose.Schema<User>(
	{
		email: String,
		firstName: String,
		lastName: String,
		userName: String,
		role: String,
		savedLocations: [{ ref: "Location", type: mongoose.Schema.Types.ObjectId }],
		// submittedLocations: [
		// 	{ ref: "Location", type: mongoose.Schema.Types.ObjectId }
		// ],
		password: {
			type: String,
			get: (): undefined => undefined
		}
	},
	{
		toJSON: {
			virtuals: true,
			getters: true
		}
	}
);

userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("submittedLocations", {
	ref: "Location",
	localField: "_id",
	foreignField: "submittedBy"
});

userSchema.pre("find", function (next) {
	this.populate("submittedLocations").populate("savedLocations");
	next();
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
