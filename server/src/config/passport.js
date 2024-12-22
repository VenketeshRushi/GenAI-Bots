const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
// const { getFileLink } = require("./../helpers/getCFLink");
const User = require("../models/User");

function initialize(passport) {
	// // Local Strategy for email/password authentication
	// passport.use(
	// 	new LocalStrategy(
	// 		{ usernameField: "email" },
	// 		async (email, password, done) => {
	// 			try {
	// 				const user = await User.findOne({ email });

	// 				if (!user) {
	// 					return done(null, false, {
	// 						message: "Invalid username or password",
	// 					});
	// 				}

	// 				const isPasswordValid = await bcrypt.compare(password, user.password);

	// 				if (!isPasswordValid) {
	// 					return done(null, false, {
	// 						message: "Invalid username or password",
	// 					});
	// 				}

	// 				user.password = undefined;

	// 				return done(null, user);
	// 			} catch (error) {
	// 				return done(error);
	// 			}
	// 		}
	// 	)
	// );

	// Google OAuth Strategy
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_REDIRECT_URI,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await User.findOne({
						googleId: profile.id,
						email: profile.emails[0].value,
					});

					if (!user) {
						const newUser = {
							name: profile.displayName,
							email: profile.emails[0].value,
							googleId: profile.id,
							avatar: profile.photos?.[0]?.value || "",
							password: accessToken,
						};
						user = await User.create(newUser);
					}

					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	// Serialize user to store in session
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	// Deserialize user to retrieve from session
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id).exec();

			if (user) {
				// user.password = undefined;
				if (user.avatar && !user.avatar.includes("googleusercontent")) {
					// user.avatar = getFileLink(user.avatar);
				}

				return done(null, user);
			}

			return done(null, false);
		} catch (error) {
			return done(error);
		}
	});
}

module.exports = initialize;
