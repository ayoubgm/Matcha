const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const			validateHeader = ( AHeader ) => {
	return ( typeof AHeader == "undefined" )
	? new Error("No authorization header found !")
	: ( !AHeader.split(" ")[0] === "Bearer" || !AHeader.split(" ")[1] ) ? new Error("No credentials sent !") : null;
}

exports.isAuth = async ( req, res, next ) => {
	const AHeader = req.headers.authorization;
	let err;

	try {
		if ( err = validateHeader( AHeader ) ) {
			return res.status( 401 ).json({ success: false, error: err.message });
		} else {
			const token = AHeader.split(" ")[1];

			jwt.verify( token, process.env.JWT_PKEY, async ( error, payload ) => {
				if ( error ) {
					return res.status( 403 ).json({ success: false, error: "Can't login, try later !" });
				} else if ( payload ) {
					await User.findOne({ 'id': payload.id })
					.then((user) => {
						if ( !user ) {
							return res.status( 401 ).json({ success: false, error: "Must login to perform this action !" });
						} else {
							req.body.userid = payload.id;
							next();
						}
					});
				}
			});
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "Can't login, try later !" });
	}
}