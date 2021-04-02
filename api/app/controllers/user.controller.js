const User = require("../models/user.model");
const Tag = require("../models/tag.model");
const Image = require("../models/image.model");
const History = require("../models/history.model");
const Blockers = require("../models/blockers.model");
const Match = require("../models/matchers.model");
const Message = require("../models/messages.model");
const Notification = require("../models/notification.model");
const { fileFilter } = require("../validators/image.validators");
const {
	completeInfosValidation,
	isUserProfileCompleted,
} = require("../validators/user.validators");
const { tagExists, tagUserExists } = require("../validators/tag.validators");
const mailFuncs = require("../helpers/mail");
const {
	generatePasswordToken,
	generateToken,
} = require("../utils/token.utils");
const {
	filterbody,
	getAge,
	getRangeAge,
	getRangeDistance,
	getRangeFame,
} = require("../helpers/helpers");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const usernameGenerator = require("username-generator");
const _ = require("lodash");

// POST - Create an account
exports.register = async (req, res) => {
	try {
		const { firstname, lastname, email, username, password } = req.body;
		const hashPassword = generatePasswordToken(password);
		const token = generateToken(email + new Date().toString());
		const aToken = encodeURIComponent(token);
		const newUser = {
			firstname: firstname,
			lastname: lastname,
			email: email,
			username: username,
			password: hashPassword,
			aToken: aToken,
		};

		await User.save(newUser)
		.then(async (user) => {
			// Send email confirmation
			await mailFuncs.sendConfirmationMail({
				token: aToken,
				email: user.email,
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname,
			});
			return res.status(201).json({ success: true, message: "Successfull registration !" });
		})
		.catch(async (error) => {
			// Delete user if an error has occurend
			await User.deleteOne({ username: username });
			return res.status(400).json({ success: false, error: "Registration failed !" });
		});
	} catch (e) {
		// Delete user if an error has occurend
		await User.deleteOne({ username: username });
		return res.status(400).json({ success: false, error: "An error has occurred while create your account, try later !" });
	}
};

// POST - Register with google account
exports.registerGoogle = async (req, res) => {
	const { tokenid, googleid, payload } = req.body;
	try {
		// Create a new account
		const newUser = {
			firstname: payload.given_name,
			lastname: payload.family_name,
			email: payload.email,
			username: usernameGenerator.generateUsername("-", 15),
			password: generatePasswordToken(payload.email + tokenid),
			verified: 1,
			googleid: googleid,
		};
		await User.save(newUser)
		.then(() => res.status(201).json({ success: true, message: "Successfull registration !" }) )
		.catch((error) => res.status(400).json({ success: false, error: "Can't create an account with your googe account !" }) );
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while register with your google account, try later !" });
	}
};

// POST - Reset password with email
exports.resetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const token = generateToken(email + new Date().toString());
		const resetToken = encodeURIComponent(token);

		await User.findOneAndUpdate({ 'email': email }, { 'rToken': resetToken })
		.then(async (userUpdated) => {
			// Send Recovery email
			await mailFuncs.sendRecoveryMail({
				token: resetToken,
				email: userUpdated.email,
				firstname: userUpdated.firstname,
				lastname: userUpdated.lastname,
			});
			return res.status(200).json({
				success: true,
				message: "A reset password link sent to your email !"
			});
		})
		.catch((error) => res.status(400).json({ success: false, error: "Failed to send reset password link !" }) );
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while reset your password, try later !" });
	}
};

// PATCH - Verify an account
exports.verify = async (req, res) => {
	const { token, email } = req.body;

	try {
		await User.findOneAndUpdate({ email: email.toLowerCase() }, { aToken: null, verified: true })
		.then(async (user) => {
			await mailFuncs.sendSuccessActivationMail({
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
			});
			return res.status(200).json({ success: true, message: "Your account has been successfully activated !" });
		})
		.catch((error) => res.status(400).json({ success: false, error: "Failed to verify your account !" }) );
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while activate your account, try later !" });
	}
};

// PATCH - New password ( reset password with token )
exports.newPassword = async (req, res) => {
	try {
		const { token, newpassword } = req.body;
		const hashPassword = generatePasswordToken(newpassword);

		await User.findOneAndUpdate(
			{ rToken: token },
			{ password: hashPassword, rToken: null }
		)
			.then((result) =>
				res.status(200).json({
					success: true,
					message: "Your password has been changed !",
				})
			)
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to change your password !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while change your password, try later !",
		});
	}
};

// POST - Login with username and password
exports.login = async (req, res) => {
	const { id, isInfosCompleted } = req.body;

	try {
		await User.findOne({ id: id }).then((user) => {
			jwt.sign(
				{ id: user.id, username: user.username },
				process.env.JWT_PKEY,
				async (err, token) => {
					if (err) {
						return res.status(400).json({ success: false, error: "Failed to login !" });
					} else {
						return res.status(200).json({
							success: true,
							message: "You have been logged in successfully !",
							token: token,
							isInfosComplete: isInfosCompleted,
						});
					}
				}
			);
		});
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while login, try later !",
		});
	}
};

// POST - Logout
exports.logout = ( req, res ) => {
	try {
		
	} catch ( e ) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while logout, try later !",
		});
	}
}

// POST - Login with google account
exports.authGoogle = async (req, res) => {
	const { tokenid, googleid, isInfosCompleted } = req.body;

	try {
		await User.findOne({ googleid: googleid }).then((user) => {
			return res.status(200).json({
				success: true,
				message: "You have been logged in successfully !",
				isInfosComplete: isInfosCompleted,
				token: jwt.sign(
					{ id: user.id, username: user.username },
					process.env.JWT_PKEY
				),
			});
		});
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while login with your google account, try later !",
		});
	}
};

// GET - Load list of matched profiles
exports.browsing = async (req, res) => {
	const userid = req.body.userid;
	const options = {
		age: {
			min: req.query.minage >= 18 && req.query.minage <= 60 ? req.query.minage : 18,
			max: req.query.maxage >= 18 && req.query.maxage <= 60 ? req.query.maxage : 60
		},
		distance: {
			min: req.query.mind >= 0 && req.query.mind <= 1000 ? req.query.mind : 0,
			max: req.query.maxd >= 0 && req.query.maxd <= 1000 ? req.query.maxd : 1000
		},
		fame: {
			min: req.query.minfame >= 0 && req.query.minfame <= 100 ? req.query.minfame : 0,
			max: req.query.maxfame >= 0 && req.query.maxfame <= 100 ? req.query.maxfame : 100
		}
	}

	try {
		await User.findOne({ id: userid }).then(async (user) => {
			await User.findSuggestions(user, options)
				.then((users) => 
					res.status(200).json({
						success: true,
						users: users,
					})
				)
				.catch((error) =>
					res.status(400).json({
						status: false,
						error: "Failed to load suggestions list !",
					})
				);
		});
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while load suggestions list, try later !",
		});
	}
};

// GET - Get user informations by id
exports.findUserById = async (req, res) => {
	const id = req.params.id;
	const userid = req.body.userid;

	try {
		await User.loadUser({ id: id }, userid)
			.then((user) => res.status(200).json(user))
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to load informations about the specified user !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while load informations about specified user, try later !",
		});
	}
};

exports.findUserByUsername = async (req, res) => {
	const username = req.params.username;
	const userid = req.body.userid;

	try {
		await User.loadUser({ id: null, username: username }, userid)
			.then((user) => res.status(200).json(user))
			.catch((error) => {
				res.status(400).json({
					success: false,
					error: "Failed to load informations about the specified user !",
				});
			});
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while load informations about specified user, try later !",
		});
	}
};

// GET - Get profile informations
exports.profileInfos = async (req, res) => {
	const userid = req.body.userid;

	try {
		await User.loadProfile(userid)
			.then(async (user) => res.status(200).json(user))
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to get profile informations !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while load profile informations, try later !",
		});
	}
};

exports.verifyToken = async ( req, res ) => {
	try {
		const { token } = req.body;

		if ( !token ) { return res.status( 200 ).json({ valide: false }); }
		else {
			jwt.verify( token, process.env.JWT_PKEY, async ( error, payload ) => {
				if ( error ) {
					return res.status( 200 ).json({ valide: false });
				} else if ( payload ) {
					await User.findOne({ 'id': payload.id })
					.then((user) => {
						if ( !user ) {
							return res.status( 200 ).json({ valide: false });
						} else {
							return res.status( 200 ).json({ valide: true });
						}
					});
				}
			});
		}
	} catch ( e ) {
		return res.status( 200 ).json({ valide: false });
	}
}

const getOptions = (search, filter) => {
	let opts = {
		search: {
			age: getRangeAge(search.minage, search.maxage),
			fame: getRangeFame(search.minfame, search.maxfame),
		},
		filter: {
			age: getRangeAge(filter.minage, filter.maxage),
			fame: getRangeFame(filter.minfame, filter.maxfame),
			distance: getRangeDistance(filter.mind, filter.maxd),
		},
	};
	return opts;
};

exports.search = async (req, res, next) => {
	const userid = req.body.userid;
	let options = getOptions(req.body, req.query);

	try {
		await User.findOne({ id: userid }).then(async (user) => {
			await User.search(user, options)
				.then((users) =>
					res.status(200).json({
						success: true,
						users: users,
					})
				)
				.catch((error) =>
					res.status(400).json({
						success: false,
						error: "Failed to load search list !",
					})
				);
		});
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while searching, try later !",
		});
	}
};

exports.isinfoscompleted = async (req, res) => {
	const userid = req.body.userid;

	try {
		await User.findOne({ id: userid })
			.then(async (user) => {
				await isUserProfileCompleted(user).then((isCompleted) =>
					res.status(200).json({
						success: true,
						complete: isCompleted,
						userid: user.id,
						username: user.username,
					})
				);
			})
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to load profile informations !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while load profile informations, try later !",
		});
	}
};

const TYPE_IMAGE = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
};
const MAX_SIZE_PICTURE_GALLERY = 5 * 1024 * 1024;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/images/users");
	},
	filename: async (req, file, cb) => {
		let decoded = jwt.verify(
			req.headers.authorization.split(" ")[1],
			process.env.JWT_PKEY
		);

		await User.findOne({ id: decoded.id }).then((user) => {
			cb(
				null,
				file.fieldname +
					"-" +
					user.username +
					"-" +
					Date.now() +
					"-" +
					"." +
					TYPE_IMAGE[file.mimetype]
			);
		});
	},
});

const uploadPictures = multer({
	storage: storage,
	limits: { fileSize: MAX_SIZE_PICTURE_GALLERY },
	fileFilter: fileFilter,
}).fields([
	{ name: "profile", maxCount: 1 },
	{ name: "gallery", maxCount: 4 },
]);

const savePictures = async (userid, profile, gallery) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Insert profile image if exists
			if (
				typeof profile != "undefined" &&
				Array.isArray(profile) &&
				profile.length != 0
			) {
				await Image.save({ url: profile[0].path, profile: 1, user_id: userid })
					.then(() => {})
					.catch(async (error) => {
						reject(new Error("Failed to save your profile picture !"));
					});
			}
			// Insert gallery image if exists
			if (
				typeof gallery != "undefined" &&
				Array.isArray(gallery) &&
				gallery.length != 0
			) {
				for (let pic of gallery) {
					await Image.save({ url: pic.path, profile: 0, user_id: userid })
						.then(() => {})
						.catch(async (error) => {
							reject(new Error("Failed to save your profile picture !"));
						});
				}
			}
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

const deleteUserImages = async (userid, profile = null, gallery = null) => {
	return new Promise(async (resolve, reject) => {
		try {
			// await Image.del({ user_id: userid });
			if (typeof profile != "undefined" && profile) {
				if (fs.existsSync(profile[0].path)) {
					fs.rmSync(profile[0].path);
				}
			}
			if (typeof gallery != "undefined" && gallery) {
				for (pic of gallery) {
					if (fs.existsSync(pic.path)) fs.rmSync(pic.path);
				}
			}
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

const saveUserTag = async (userid, tagid) => {
	return new Promise(async (resolve, reject) => {
		try {
			await tagUserExists(userid, tagid).then(async (tag) => {
				if (!tag) {
					await Tag.saveUserTag(userid, tagid)
						.then(() => {
							resolve();
						})
						.catch((error) => {
							reject(error);
						});
				} else {
					resolve();
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteUserTags = async (userid) => {
	return new Promise(async (resolve, reject) => {
		try {
			await Tag.deleteUserTags(userid)
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		} catch (e) {
			reject(e);
		}
	});
};

const saveTags = async (userid, tags) => {
	return new Promise(async (resolve, reject) => {
		try {
			let ATags = Array.isArray(tags) ? tags : tags.split(",");

			for (let tagname of ATags) {
				await tagExists(tagname)
					.then(async (tag) => {
						if (!tag) {
							// Save new Tag
							await Tag.save({ name: tagname.toLowerCase().trim() })
								.then(async (newTag) => {
									await saveUserTag(userid, newTag.id);
								})
								.catch((error) => {
									reject(new Error("Failed to save a new tag !"));
								});
						} else {
							await saveUserTag(userid, tag.id);
						}
					})
					.catch((error) => {
						reject(error);
					});
			}
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

exports.setStatus = async ( req, res ) => {
	const { userid } = req.body;
	
	try {
		await User.setStatus( userid )
		.then(() => {
			return res.status(200).json({ success: true });
		})
	} catch ( e ) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while change status, try later !",
		});
	}
}

exports.getStatus = async ( req, res ) => {
	const id = req.params.id;
	
	try {
		await User.getStatus( id )
		.then((status) => {
			return res.status(200).json({ success: true, data: status });
		});
	} catch ( e ) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while change status, try later !",
		});
	}
}

// PATCH - Complete profile informations
exports.completeInfos = async (req, res) => {
	let errMsg;
	const userid = req.body.userid;

	try {
		await deleteUserTags(userid);
		await deleteUserImages(userid);
		uploadPictures(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				switch (err.code) {
					case "LIMIT_FILE_SIZE":
						errMsg = "The file must be less than 2MB !";
						break;
					case "LIMIT_UNEXPECTED_FILE":
						errMsg = "Unexpected fields to get files from !";
						break;
					default:
						errMsg = "An error has occurend while validate uploaded files !";
						break;
				}
				return res.status(400).json({ success: false, error: errMsg });
			} else if (err) {
				return res.status(400).json({ success: false, error: err });
			} else {
				try {
					const profile = req.files.profile;
					const gallery = req.files.gallery;
					const body = req.body;

					await completeInfosValidation(body, profile, gallery)
						.then(async () => {
							// -> Save user tags
							await saveTags(userid, body.tags).then(async () => {
								// -> Save pictures
								await savePictures(userid, profile, gallery).then(async () => {
									// -> Update user infomations
									await User.findOneAndUpdate(
										{ id: userid },
										{
											gender: body.gender.toLowerCase(),
											looking: body.looking.toLowerCase(),
											bio: body.bio.toLowerCase(),
											birthday: new Date(body.birthday),
											age: getAge(new Date(body.birthday)),
											lat: body.lat,
											lag: body.lang,
											country: body.country.toLowerCase(),
											city: body.city.toLowerCase(),
										}
									).then(() =>
										res.status(200).json({
											success: true,
											message:
												"Your informations has been completed successfully !",
										})
									);
								});
							});
						})
						.catch(async (error) => {
							await deleteUserTags(userid);
							await deleteUserImages(profile, gallery);
							return res.status(400).json({
								success: false,
								error: error.message,
							});
						});
				} catch (e) {
					await deleteUserTags(userid);
					await deleteUserImages(profile, gallery);
					return res.status(400).json({
						success: false,
						error: "Failed to complete your informations !",
					});
				}
			}
		});
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while complete your informations, try later !",
		});
	}
};

const editUserTags = async (userid, tags) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Delete old tags
			await deleteUserTags(userid)
				.then(async () => {
					// Create edieted tags
					await saveTags(userid, tags)
						.then(() => {
							resolve();
						})
						.catch((error) => {
							reject(error);
						});
				})
				.catch((error) => {
					reject(error);
				});
		} catch (e) {
			reject(e);
		}
	});
};

// PATCH - Update profile informations
exports.editInfos = async (req, res) => {
	const {
		userid,
		firstname,
		lastname,
		username,
		email,
		gender,
		looking,
		bio,
		birthday,
		tags,
	} = await filterbody(req.body);

	try {
		await User.findOne({ id: userid }).then(async (user) => {
			// Edit user tags
			await editUserTags(userid, tags || user.tags)
				.then(async () => {
					// Edit informations
					await User.findOneAndUpdate(
						{ id: userid },
						{
							firstname: firstname || user.firstname,
							lastname: lastname || user.lastname,
							username: username || user.username,
							email: email || user.email,
							gender: gender || user.gender,
							looking: looking || user.looking,
							bio: bio || user.bio,
							birthday: birthday || user.birthday,
						}
					)
						.then(() =>
							res.status(200).json({
								success: true,
								message: "Your informations has been updated successfully !",
							})
						)
						.catch((error) =>
							res.status(400).json({
								success: false,
								error: "Failed to edit your informations !",
							})
						);
				})
				.catch((error) =>
					res.status(400).json({
						success: false,
						error: "Failed to edit your tags !",
					})
				);
		});
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while edit informations, try later !",
		});
	}
};

// PATCH - Changpe password
exports.changepassword = async (req, res) => {
	const { userid, newpassword } = req.body;

	try {
		const hashNewPassword = generatePasswordToken(newpassword);

		await User.findOneAndUpdate({ id: userid }, { password: hashNewPassword })
			.then(async () =>
				res.status(200).json({
					success: true,
					message: "Your password has been changed successfully !",
				})
			)
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to change your password !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while change your password, try later !",
		});
	}
};

// PATCH - edit user location
exports.editLocation = async (req, res) => {
	const { userid, country, city, lat, lang } = req.body;

	try {
		await User.findOneAndUpdate(
			{ id: userid },
			{
				lat: lat,
				lag: lang,
				country: country,
				city: city,
			}
		)
			.then(() =>
				res.status(200).json({
					success: true,
					message: "Your location has been updated successfully !",
				})
			)
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to edit your location !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while edit your location, try later !",
		});
	}
};

// PUT - Like a user
exports.like = async ( req, res ) => {
	const id = parseInt( req.params.id );
	const { userid, likedBySpecifiedUser } = req.body;

	try {
		// -> Create like 
		await History.like( userid, id )
		.then( async () => {
			if ( likedBySpecifiedUser ) {
				/**
				 * -> Match users and create a chat
				 */
				await Match.match( userid, id );
				await Message.createRoomChat( userid, id );
				await Notification.create({ content: "Liked you back !", to: id, from: userid });
			}
			return res.status( 200 ).json({ success: true, message: "Liked successfully !" });
		})
		.catch( async (error) => {
			// Delete Like created if an error had occurred
			await History.unlike( userid, id );
			return res.status( 400 ).json({ success: false, error: "Failed to like the specified user !" });
		});
	} catch ( e ) {
		// Delete Like created if an error had occurred
		await History.unlike( userid, id );
		return res.status(400).json({ success: false, error: "An error has occurred while like the specified user, try later !" });
	}
}

// PUT - Unlike a user
exports.unlike = async ( req, res ) => {
	const id = parseInt( req.params.id );
	const { userid, matched } = req.body;

	try {
		await History.unlike( userid, id )
		.then( async () => {
			if ( matched ) {
				/**
				 * -> Unmatch users and delete chat between users
				 */
				await Match.unmatch( userid, id );
				await Message.deleteRoomChar( userid, id );
			}
			return res.status( 200 ).json({ success: true, message: "Unliked successfully !" });
		})
		.catch((error) =>
			res.status( 200 ).json({ success: false, error: "Failed to unlike the specified user !" })
		)
	} catch ( e ) {
		return res.status(400).json({ success: false, error: "An error has occurred while unlike the specified user, try later !" });
	}
}

exports.blacklist = async (req, res) => {
	const userid = req.body.userid;

	try {
		await Blockers.getBlacklist(userid)
			.then((list) =>
				res.status(200).json({
					success: true,
					data: JSON.parse(list),
				})
			)
			.catch(() =>
				res.status(400).json({
					success: false,
					error: "Failed to load your blacklist !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while load your blacklist, try later !",
		});
	}
};

exports.block = async (req, res) => {
	const { blocked } = req.params;
	const { userid } = req.body;

	try {
		await Blockers.block(userid, blocked)
			.then(() =>
				res.status(200).json({
					success: true,
					message: "Blocked successfully !",
				})
			)
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to block the specified user, try later !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while block the specified user, try later !",
		});
	}
};

exports.unblock = async (req, res) => {
	const { unblocked } = req.params;
	const { userid } = req.body;

	try {
		await Blockers.unblock(userid, unblocked)
			.then(() =>
				res.status(200).json({
					success: true,
					message: "Unblocked successfully !",
				})
			)
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to unblock the specified user, try later !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while unblock the specified user, try later !",
		});
	}
};

exports.report = async (req, res) => {
	const { id } = req.params;

	try {
		await User.report(id)
			.then(() =>
				res.status(200).json({
					success: true,
					message: "Reported succssfully !",
				})
			)
			.catch((error) =>
				res.status(200).json({
					success: false,
					error: "Failed to report the specified user !",
				})
			);
	} catch (e) {
		return res.status(400).json({
			success: false,
			error: "An error has occurred while report the specified user, try later !",
		});
	}
};