const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	name: { type: String, required: false, default: "Guest" },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	googleId: { type: String, default: "" },
	isAdmin: { type: Boolean, default: false },
	avatar: { type: String, default: "" },
	membership: {
		activeMembership: { type: Boolean, default: false },
		membershipExpiration: {
			type: Date,
			default: () => {
				const expirationDate = new Date();
				expirationDate.setMonth(expirationDate.getMonth() + 6); // Add 6 months to the current date
				return expirationDate;
			},
		},
		membershipType: { type: String, default: "Free" },
		membershipPrice: { type: Number, default: 0 },
	},
	credentials: {
		type: String,
		required: false,
	},
});

// Pre-save hook for hashing password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // Only hash if password is modified
	try {
		this.password = await bcrypt.hash(this.password, 10);
		next(); // Proceed with saving the document
	} catch (err) {
		next(err); // Pass error to the next middleware if hashing fails
	}
});

module.exports = mongoose.model("User", userSchema);
