const User = require("../models/user.model");
const Image = require("../models/image.model");
const History = require("../models/history.model");
const Match = require("../models/matchers.model");
const {
	validateRegisterData,
	validateUniqueFields,
	isUniqueEmail,
	emailExists,
	isUserProfileCompleted,
	validatePassword,
	validateEditedInformations,
	isOldpassValid,
	validateLocation
} = require("../validators/user.validators");
const { compare } = require("../utils/token.utils");
const { filterbody, getPayloadGoogleAccount  } = require("../helpers/helpers");
const Blockers = require("../models/blockers.model");
const { user } = require("../../config/dbconfig");
const { match } = require("../models/matchers.model");

exports.register = async ( req, res, next ) => {
	let error;
	
	try {
		const body = req.body = { firstname, lastname, email, username, password, confirmpassword } = await filterbody( req.body );
		
		if ( !body.firstname || !body.lastname || !body.email || !body.username || !body.password || !body.confirmpassword ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else if ( error = validateRegisterData( body ) ) {
			return res.status( 400 ).json({ success: false, error: error.message });
		} else {
			await validateUniqueFields( body.email, body.username )
			.then(() => { next(); })
			.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate account informations, try later !" });
	}
}

exports.registerGoogle = async ( req, res, next ) => {
	const { tokenid, googleid } = req.body;
	
	try {
		if ( !tokenid | !googleid ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			// Get informations about google account
			await getPayloadGoogleAccount( tokenid )
			.then( async ( payload ) => {
				// Validate email account if already exists
				await isUniqueEmail( payload.email )
				.then( async () => {
					// Validate google id account if already exists
					await User.findOne({ 'googleid': googleid })
					.then((user) => {
						if ( user ) {
							return res.status( 400 ).json({ success: false, error: "The account already exists !" });
						} else {
							req.body.payload = payload;
							next();
						}
					})
					.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate your google account informations !" }) );
				})
				.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
			})
			.catch(( error ) => res.status( 400 ).json({ success: false, error: "Failed to get google account informations, try later !" }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate google account, try later !" });
	}
}

exports.verify = async ( req, res, next ) => {
	const { token } = req.body;
	
	try {
		if ( !token ) {
			return res.status( 400 ).json({ success: false, error: "No token activation found !" });
		} else {
			await User.findOne({ 'aToken': token })
			.then(( user ) => {
				if ( !user ) {
					return res.status( 400 ).json({ success: false, error: "Activation token is invalid or the account already activated !" });
				} else {
					req.body.email = user.email;
					next();
				}
			})
			.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate activation token !" }) );
		}
	} catch( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate your account, try later !" });
	}
}

exports.resetPassword = async ( req, res, next ) => {
	
	try {
		const { email } = req.body = await filterbody( req.body );

		if ( !email ) {
			return res.status( 400 ).json({ success: false, error: "Can't be blank !" });
		} else {
			await emailExists( email )
			.then((user) => {
				if ( !user ) {
					return res.status( 400 ).json({ success: false, error: "The account doesn't exists !" });
				} else {
					next();
				}
			})
			.catch((err) => res.status( 400 ).json({ success: false, error: "Failed to verify your account !" }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate your email, try later !" });
	}
}

exports.newPassword = async ( req, res, next ) => {
	const { token, newpassword, confirmpassword } = req.body;
	let error;
	
	try {
		if ( !token ) {
			return res.status( 400 ).json({ success: false, error: "No recovery token found !" });
		} else if ( !newpassword || !confirmpassword ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			await User.findOne({ 'rToken': token })
			.then((user) => {
				if ( !user ) {
					return res.status( 400 ).json({ success: false, error: "The recovery token is invalid !" });
				} else if ( error = validatePassword( newpassword ) ) {
					return res.status( 400 ).json({ success: false, error: error.message });
				} else if ( newpassword != confirmpassword ) {
					return res.status( 400 ).json({ success: false, error: "Passwords doesn't match !" });
				} else {
					next();
				}
			})
			.catch((err) => res.status( 400 ).json({ success: false, error: "Failed to verify your recovery token !" }) );
		}
	} catch( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate passwords, try later !" });
	}
}

exports.login = async ( req, res, next ) => {
	const { username, password } = req.body;
	
	try {
		// If the username or password are incorrect 
		if ( !username || !password ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			await User.findOne({ 'username': username.toLowerCase() })
			.then( async (user) => {
				if ( !user || !( await compare( password, user.password ) ) ) {
					return res.status( 400 ).json({ success: false, error: "The username or password is incorrect !" });
				} else if ( !user.verified ) {
					return res.status( 401 ).json({ success: false, error: "You must confirm your account first !" });
				} else {
					await isUserProfileCompleted( user )
					.then((isCompleted) => {
						req.body.id = user.id;
						req.body.isInfosCompleted = isCompleted;
						next();
					})
					.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate your informations !" }) );
				}
			})
			.catch((err) => res.status( 400 ).json({ success: false, error: "Failed to validate your login informations !" }) );
 		}
	} catch( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate login informations, try later !" });
	}
}

exports.authGoogle = async ( req, res, next ) => {
	const { tokenid, googleid } = req.body;
	
	try {
		if ( !tokenid | !googleid ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			await User.findOne({ 'googleid': googleid })
			.then( async (user) => {
				if ( !user ) {
					return res.status( 400 ).json({ success: false, error: "An account with the specified google account doesn't exists !" });
				} else {
					await isUserProfileCompleted( user )
					.then((isCompleted) => {
						req.body.userid = user.id;
						req.body.username = user.username;
						req.body.isInfosCompleted = isCompleted;
						next();
					})
				}
			})
			.catch((error) => {
				return res.status( 400 ).json({ success: false, error: "Failed to validate your google account informations !" });
			});
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate google account, try later !" });
	}
}

exports.findUserById = async ( req, res, next ) => {
	const id = req.params.id;

	try {
		await User.findOne({ 'id': id })
		.then((user) => {
			if ( !user ) return res.status( 404 ).json({ success: false, error: "The user is not found !" });
			else next();
		})
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to validate the user specified !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified user, try later !" });
	}
}

exports.findUserByUsername = async ( req, res, next ) => {
	const username = req.params.username;

	try {
		await User.findOne({ 'username': username })
		.then((user) => {
			if ( !user ) return res.status( 404 ).json({ success: false, error: "The user is not found !" });
			else next();
		})
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to validate the user specified !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified user, try later !" });
	}
}

exports.completeInfos = async ( req, res, next ) => {
	const { userid } = req.body;

	try {
		await User.findOne({ 'id': userid })
		.then( async (user) => {
			await isUserProfileCompleted( user )
			.then((isCompleted) => {
				if ( !isCompleted ) return res.status( 401 ).json({ success: false, error: "Must complete your profile informations !" });
				else next();
			})
		})
		.catch((error) => res.status( 400 ).json({ success: false, error: "An error has occurred to validate account informations !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate account informations, try later !" });
	}
}

exports.isProfileCompleted = async ( req, res, next ) => {
	const { userid } = req.body;

	try {
		await User.findOne({ 'id': userid })
		.then( async (user) => {
			await isUserProfileCompleted( user )
			.then((isCompleted) => {
				if ( isCompleted ) return res.status( 400 ).json({ success: false, error: "Profile informations already completed !" });
				else next();
			})
		})
		.catch((error) => res.status( 400 ).json({ success: false, error: "An error has occurred to validate account informations !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate account informations, try later !" });
	}
}

exports.editInfos = async ( req, res, next ) => {
	const { userid, firstname, lastname, username, email, gender, looking, birthday, tags } = req.body;
	
	try {
		await validateEditedInformations( userid, firstname, lastname, username, email, gender, looking, birthday, tags )
		.then(() => { next(); })
		.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate new informations, try later !" });
	}
}

exports.changepassword = async ( req, res, next ) => {
	const { userid, oldpassword, newpassword, confirmpassword } = req.body;

	try {
		if ( !oldpassword || !newpassword || !confirmpassword ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else if ( error = validatePassword( oldpassword ) ) {
			return res.status( 400 ).json({
				success: false,
				error: "The old password must be at least one uppercase letter, one lowercase letter, one number and one special character ( min 8 characters ) !"
			});
		} else if ( error = validatePassword( newpassword ) ) {
			return res.status( 400 ).json({
				success: false,
				error: "The new password must be at least one uppercase letter, one lowercase letter, one number and one special character !"
			});
		} else if ( newpassword != confirmpassword ) {
			return res.status( 400 ).json({ success: false, error: "The passwords doesn't match !" });
		} else {
			await isOldpassValid( userid, oldpassword )
			.then(() => { next(); })
			.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate passwords, try later !" });
	}
}

exports.editLocation = async ( req, res, next ) => {
	const { country, city, lat, lang } = req.body;
	let error;
	
	try {
		if ( error = validateLocation( lang, lat, country, city ) ) {
			return res.status( 400 ).json({ success: false, error: error.message });
		} else {
			next();
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate informations, try later !" });
	}
}

exports.like = async ( req, res, next ) => {
	const id = parseInt( req.params.id );
	const { userid } = req.body;

	try {
		if ( !id ) {
			return res.status( 400 ).json({ success: false, error: "Something is missing !" });
		} else if ( userid === id ) {
			return res.status( 400 ).json({ success: false, error: "Its your own profile dude !" });
		} else {
			// Check if the specified user exists
			await User.findOne({ 'id': id })
			.then( async (user) => {
				if ( !user ) {
					return res.status( 404 ).json({ success: false, error: "The user specified is not found !" });
				} else {
					// Check if the connected user have a profile picture
					await Image.findProfileImage( userid )
					.then( async (found) => {
						if ( !found ) {
							return res.status( 400 ).json({ success: false, error: "Can't complete like action !" });
						} else {
							// Check if the user already like the specified user
							await History.findLike( userid, id )
							.then((like) => {
								if ( like ) return res.status( 400 ).json({ success: false, error: "You already like the specified profile !" });
								else next();
							});
						}
					});
				}
			})
			.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate the specified user !" }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified user to like, try later !" });
	}
}

exports.likedBack = async ( req, res, next ) => {
	const id = parseInt( req.params.id );
	const { userid } = req.body;

	try {
		// Check if the specified user already like the connected user
		await History.findLike( id, userid )
		.then((like) => {
			req.body.likedBySpecifiedUser = ( like ) ? true : false;
			next();
		});
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified user to like, try later !" });
	}
}

exports.unlike = async ( req, res, next ) => {
	const id = parseInt( req.params.id );
	const { userid } = req.body;

	try {
		if ( !id ) {
			return res.status( 400 ).json({ success: false, error: "Something is missing !" });
		} else if ( userid === id ) {
			return res.status( 400 ).json({ success: false, error: "Its your own profile dude !" });
		} else {
			// Check if the specified user is exists
			await User.findOne({ 'id': id })
			.then( async (user) => {
				if ( !user ) {
					return res.status( 404 ).json({ success: false, error: "The user specified is not found !" });
				} else {
					await History.findLike( userid, id )
					.then((like) => {
						if ( !like ) return res.status( 400 ).json({ success: false, error: "You didn't like him yet !" });
						else next();
					})
				}
			})
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified user to unlike, try later !" })
	}
}

exports.isMatch = async ( req, res, next ) => {
	const id = parseInt( req.params.id );
	const { userid } = req.body;

	try {
		// Check if the connected user already matched with specified user
		await Match.findMatch( userid, id )
		.then((match) => {
			req.body.matched = ( match ) ? true : false;
			next();
		})
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified user to unlike, try later !" })
	}
}

exports.block = async ( req, res, next ) => {
	const { blocked } = req.params;
	const { userid } = req.body;

	try {
		if ( !blocked ) {
			return res.status( 400 ).json({ success: false, error: "Something is missing !" });
		} else if ( blocked == userid ) {
			return res.status( 400 ).json({ success: false, error: "Its your own profile dude !" });
		} else {
			await User.findOne({ 'id': blocked })
			.then( async () => {
				if ( !user ) {
					return res.status( 404 ).json({ success: false, error: "The user specified is not found !" });
				} else {
					await Blockers.findBlock( userid, blocked )
					.then((block) => {
						if ( block ) return res.status( 400 ).json({ success: false, error: "You already block the specified user !" });
						else next();
					})
					.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate the user to block !" }) );
				}
			})
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate informations, try later !" });
	}
}

exports.unblock = async ( req, res, next ) => {
	const { unblocked } = req.params;
	const { userid } = req.body;

	try {
		if ( !unblocked ) {
			return res.status( 400 ).json({ success: false, error: "Something is missing !" });
		} else if ( unblocked == userid ) {
			return res.status( 400 ).json({ success: false, error: "Its your own profile dude !" });
		} else {
			await User.findOne({ 'id': unblocked })
			.then( async () => {
				if ( !user ) {
					return res.status( 404 ).json({ success: false, error: "The user specified is not found !" });
				} else {
					await Blockers.findBlock( userid, unblocked )
					.then((block) => {
						if ( !block ) return res.status( 400 ).json({ success: false, error: "You did not block the specified user yet !" });
						else next();
					})
					.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate the user to unblock !" }) );
				}
			})

		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate informations, try later !" });
	}
}

exports.report = async ( req, res, next ) => {
	const { id } = req.params;
	const { userid } = req.body;
	
	try {
		if ( id == userid ) return res.status( 400 ).json({ success: false, error: "Its your own profile dude !" });
		else next();
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified user, try later !" });
	}
}