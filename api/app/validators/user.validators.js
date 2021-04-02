const User = require("../models/user.model");
const Image = require("../models/image.model");
const Tag = require("../models/tag.model");
const { fileSizeFilter } = require("../validators/image.validators");
const { validateTag, tagExists } = require("../validators/tag.validators");
const { getAge } = require("../helpers/helpers");
const { compare } = require("../helpers/generateTokens.js");

const				validatefirstname = ( firstname ) => ( !/^[a-z]{3,}$/.test( firstname.toLowerCase() ) ) ? new Error( "The first name must be contains letters only, 3 letters minimum !" ) : ( firstname.length > 30 ) ? new Error( "The firstname is too long !" ) : null;

const				validatelastname = ( lastname ) => ( !/^[a-z]{3,}$/.test( lastname.toLowerCase() ) ) ? new Error( "The last name must be contains letters only, 3 letters minimum !" ) : ( lastname.length > 30 ) ? new Error( "The last name is too long !" ) : null;

const				validateUsername = ( username ) => ( !/^[a-z]+(([-_.]?[a-z0-9])?)+$/.test( username.toLowerCase() ) ) ? new Error( "The username must be contains letters or numbers ( -, _ or . ) !" ) : ( username.length < 3 || username.length > 20 ) ? new Error( "The username should be between 3 and 20 characters !" ) : null;

const				validateEmail = ( email ) => ( !/[a-z0-9-_.]{1,50}@[a-z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/.test( email.toLowerCase() ) ) ? new Error( "Invalid email address !" ) : null;

const				validatePassword = ( password ) => ( !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/.test( password ) ) ? new Error( "The password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !" ) : null;

const				validateGender = ( gender ) => ( !["male", "female", "other"].includes( gender.toLowerCase().trim() ) ) ? new Error( "The gender must either male, female or other !" ) : null;

const				validateBirthday = ( birthday ) => {
	const date = new Date( birthday );

	return ( !( date instanceof Date ) || isNaN( date ) ) ? new Error( "The birthday have an invalid format !" ) : null;
}

const				validateAge = ( DOB ) => {
	const birthday = new Date( DOB );
	const age = getAge( birthday );
	
	return ( age <= 18 ) ? new Error("You age must be greater or equal than 18 years old !") : null;
}

const				validateLooking = ( looking ) => ( !["male", "female", "other"].includes( looking.toLowerCase().trim() ) ) ? new Error( "The interesting gender must either male, female or other !" ) : null;

const				validateBio = ( bio ) => ( !/^([\w\s ,.!?@#$^&*()\[\]'";:-_=+]){10,100}$/.test( bio.toLowerCase() ) ) ? new Error("The biography must be at least 10 characters ( max 100 ) !") : null;

const	isLatitude = ( lang ) => ( isFinite( lang ) && Math.abs( lang ) <= 90 ) ? true : false;

const	isLongitude = ( lat ) => ( isFinite( lat ) && Math.abs( lat ) <= 180 ) ? true : false;

const				emailExists = async ( email ) =>
	new Promise( async (resolve, reject) => {
		try {
			await User.findOne({ 'email': email.toLowerCase() })
			.then((user) => { resolve( user ); })
			.catch((err) => { reject( new Error( "Failed to find your email !" ) ); });
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate your email, try later !" ) );
		}
	});

const				isUniqueEmail = async ( email ) =>
	new Promise( async (resolve, reject) => {
		try {
			await emailExists( email )
			.then((user) => {
				if ( user ) { reject( new Error( "The email is already exists !" ) ); }
				else { resolve(); }
			})
			.catch((err) => { reject( err ); });
		} catch( e ) {
			reject( new Error( "An error has occurred while validate your email, try later !" ) );
		}
	});

const				usernameExists = async ( username ) =>
	new Promise( async (resolve, reject) => {
		try {
			await User.findOne({ 'username': username.toLowerCase() })
			.then((user) => { resolve( user ); })
			.catch((err) => { reject( new Error( "Failed to find your username !" ) ); });
		} catch( e ) {
			reject( new Error( "An error has occurred while validate your username, try later !" ) );
		}
	});

const				isUniqueUsername = async ( username ) =>
	new Promise( async (resolve, reject) => {
		try {
			await usernameExists( username )
			.then(( user ) => {
				if ( user ) { reject( new Error( "The username is already exists !" ) ); }
				else { resolve(); }
			})
			.catch((err) => { reject( err ); });
		} catch( e ) {
			reject( new Erorr( "An error has occurred while validate your username, try later !" ) );
		}
	});

const				validateRegisterData = ( user ) => {
	let err;

	if (
		( err = validatefirstname( user.firstname ) ) ||
		( err = validatelastname( user.lastname ) ) ||
		( err = validateEmail( user.email ) ) ||
		( err = validateUsername( user.username ) ) ||
		( err = validatePassword( user.password ) )
	) {
		return err;
	} else if ( user.password != user.confirmpassword ) {
        return new Error( "The passord confirmation doesn't match the password provided !" );
	}
}

const				validateUniqueFields = async ( email, username ) =>
	new Promise( async (resolve, reject) => {
		try {
			await isUniqueEmail( email )
			.then( async () => {
				await isUniqueUsername( username )
				.then(() => { resolve(); })
				.catch((err) => { reject( err ); });
			})
			.catch((err) => { reject( err ); });
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate your email and username, try later !" ) );
		}
	});

const				validateLocation = ( lang, lat, country, city ) =>
	( !lang || !lat || !country || !city ) ? new Error( "Something is missing in location informations !" )
	: !isLongitude( parseFloat( lang ) ) ? new Error( "The Longitude is not valid !" )
	: !isLatitude( parseFloat( lat ) ) ? new Error( "The Latitude is not valid !" )
	: null;

const				isUserProfileCompleted = async ( user ) => {
	return new Promise( async (resolve, reject) => {
		try {
			if ( !user.gender || !user.looking || !user.birthday || !user.bio || !user.lang || !user.lat || !user.country || !user.city ) {
				resolve( false );
			} else {
				// Validate if the user have at least on tag
				await Tag.findUserTags( user.id )
				.then( async (tags) => {
					const tagsArr = JSON.parse( tags );

					if ( !tagsArr.length ) {
						resolve( false );
					} else {
						// Validate if the user have at least one picture
						await Image.findProfileImage( user.id )
						.then((profile) => { resolve ( profile ? true : false ); })
						.catch((err) => { reject( new Error("Failed to validate your pictures !") ); });
					}
				})
				.catch((err) => { reject( new Error("Failed to validate your tags !") ); });
			}
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate account informations, try later !" ) );
		}
	});
}

const				validateUserImages = async ( profile, gallery ) => {
	return new Promise( async (resolve, reject) => {
		try {
			if ( typeof profile == 'undefined' || !profile || !Array.isArray( profile ) || !profile.length ) {
				reject( new Error( "The profile picture is required !" ) );
			} else {
				await fileSizeFilter( profile, gallery )
				.then(() => { resolve(); })
				.catch((error) => { reject( new Error( error ) ); });
			}
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate pictures, try later !" ) );
		}
	});
}

const				validateTags = async ( tags ) => {
	return new Promise( async (resolve, reject) => {
		try {
			;
			if ( !tags || tags.length == 0 ) {
				reject(new Error("Must be one tag at least !"));
			} else {
				let ATags = ( Array.isArray( tags ) ) ? tags : tags.split(',')
				if ( ATags.length <= 5 ) {
					ATags.forEach((tag) => { if ( error = validateTag( tag ) ) reject( error ); });
					resolve();
				} else {
					reject(new Error("Tags are limit is 5 tags !"));
				}
			}
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate tags, try later !" ) );
		}
	});
}

const				validateInformations = async ( gender, looking, bio, tags, birthday ) => {
	let error;

	return new Promise( async ( resolve, reject ) => {
		try {
			if ( !gender || !looking || !bio || !tags || !birthday ) {
				reject( new Error( "Something missing in your information !" ) );
			} else if (
				( error = validateGender( gender ) ) ||
				( error = validateLooking( looking ) ) ||
				( error = validateBio( bio ) ) ||
				( error = validateBirthday( birthday ) ) ||
				( error = validateAge( birthday ) )
			) {
				reject( error );
			} else {
				await validateTags( tags )
				.then(() => { resolve(); })
				.catch((error) => { reject( error ); });
			}
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate your informations, try later !" ) );
		}
	});
}

const				completeInfosValidation = async ( infos, profile, gallery ) => {
	return new Promise( async (resolve, reject) => {
		try {
			if ( error = validateLocation( infos.lang, infos.lat, infos.country, infos.city ) ) {
				reject( error );
			} else {
				await validateUserImages( profile, gallery )
				.then( async () => {
					await validateInformations( infos.gender, infos.looking, infos.bio, infos.tags, infos.birthday )
					.then( async () => {
						resolve();
					})
					.catch((error) => { reject( error ); });
				})
				.catch((error) => { reject( error ); });
			}
		} catch ( e ) {
			reject(new Error( "An error has occurred while validate complete informations, try later !" ));
		}
	});
}

const					isNewUsernameExists = async ( id, username ) => {
	return new Promise( async (resolve, reject) => {
		try {
			await User.findNewUsername( id, username )
			.then((user) => { resolve( user ); })
			.catch((error) => { reject( new Error("Failed to validate new username !") ); });
		} catch ( e ) {
			reject( new Error("An error has occurred while validate edited username, try later !") );
		}
	});
}

const					isNewEmailExists = async ( id, email ) => {
	return new Promise( async (resolve, reject) => {
		try {
			await User.findNewEmail( id, email )
			.then((user) => { resolve( user ); })
			.catch((error) => { reject( new Error("Failed to validate new email !") ); });
		} catch ( e ) {
			reject( new Error("An error has occurred while validate edited email, try later !") );
		}
	});
}

const					validateNewUsername = async ( id, username ) => {
	return new Promise(async (resolve, reject) => {
		try {
			
			if ( username ) {
				await isNewUsernameExists( id, username )
				.then((user) => {
					if ( user ) reject( new Error("The new username is already exists !") );
					else resolve();
				})
				.catch((error) => {
					reject( error );
				});
			} else {
				resolve();
			}
		} catch ( e ) {
			reject( new Error("An error has occurred while validate edited username, try later !") );
		}
	});
}

const					validateNewEmail = async ( id, email ) => {
	return new Promise(async (resolve, reject) => {
		try {
			
			if ( email ) {
				await isNewEmailExists( id, email )
				.then((user) => {
					if ( user ) reject( new Error("The new email is already exists !") );
					else resolve();
				})
				.catch((error) => {
					reject( error );
				});
			} else {
				resolve();
			}
		} catch ( e ) {
			reject( new Error("An error has occurred while validate edited email, try later !") );
		}
	});
}

const					validateEditedUniqueFields = async ( id, username, email ) => {
	return new Promise( async (resolve, reject) => {
		try {
			await validateNewUsername( id, username )
			.then( async () => {
				await validateNewEmail( id, email )
				.then(() => { resolve(); })
				.catch((error) => { reject( error ); });
			})
			.catch((error) => { reject( error ); });
		} catch ( e ) {
			reject( new Error("An error has occurred while validate edited unique fields, try later !") );
		}
	});
}

const					validateEditedInformations = async ( id, firstname, lastname, username, email, gender, looking, birthday, tags, bio ) => {
	return new Promise( async (resolve, reject) => {
		try {
			// Validate simple data
			if (
				( firstname && ( error = validatefirstname( firstname ) ) ) ||
				( lastname && ( error = validatelastname( lastname ) ) ) ||
				( gender && ( error = validateGender( gender ) ) ) ||
				( looking && ( error = validateLooking( looking ) ) ) ||
				( birthday && ( error = validateBirthday( birthday ) ) ) ||
				( bio && ( error = validateBio( bio ) ) )
			) {
				reject( error );
			} else {
				// Validate unique fields
				await validateEditedUniqueFields( id, username, email )
				.then( async () => {
					// Validate tags
					await validateTags( tags )
					.then(() => { resolve(); })
					.catch((error) => { reject( error ); });
				})
				.catch((error) => { reject( error ); });
			}
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate edit informations, try later !" ) );
		}
	});
}

const			isOldpassValid = async ( userid, oldpassword ) => {
	return new Promise( async (resolve, reject) => {
		try {
			await User.findOne({ 'id': userid })
			.then( async (user) => {
				if ( ! await compare( oldpassword, user.password ) ) reject( new Error( "The old password is incorrect !" ) ); 
				else resolve();
			});
		} catch ( e ) {
			reject( new Error( "An error has occurred while validate old password, try later !" ) );
		}
	});
}

module.exports = {
	validatefirstname,
	validatelastname,
	validateEmail,
	validateUsername,
	validatePassword,
	validateGender,
	validateBirthday,
	validateAge,
	validateLooking,
	validateBio,
	emailExists,
	usernameExists,
	isUniqueEmail,
	isUniqueUsername,
	isLongitude,
	isLatitude,
	validateRegisterData,
	validateUniqueFields,
	isUserProfileCompleted,
	validateLocation,
	validateUserImages,
	validateInformations,
	completeInfosValidation,
	validateEditedInformations,
	validateEditedUniqueFields,
	validateNewUsername,
	isOldpassValid
}