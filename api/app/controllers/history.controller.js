const History = require("../models/history.model");

// GET - visits history
exports.visitsHistory = async ( req, res ) => {
	const userid = req.body.userid;
	
	try {
		await History.getVisitsHistory( userid )
		.then((users) => res.status( 200 ).json({ success: true, data: users }) )
		.catch((error) => res.status( 400 ).json({ succes: false, error: "Failed to get your visits history !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while load visits history, try later !" });
	}
}

// GET - Load viewrs of connected user
exports.loadViewers = async ( req, res ) => {
	const userid = req.body.userid;

	try {
		await History.getUserViewers( userid )
		.then((users) => res.status( 200 ).json({ success: true, data: users }) )
		.catch((error) => res.status( 400 ).json({ succes: false, error: "Failed to get viewers list of your profile !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while load viewers list of your profile, try later !" });
	}
}

// GET - Load followers 
exports.loadFollowers = async ( req, res ) => {
	const userid = req.params.id;

	try {
		await History.getUserFollowers( userid )
		.then((users) => res.status( 200 ).json({ success: true, data: users }) )
		.catch((error) => { res.status( 400 ).json({ succes: false, error: "Failed to get followers list of the specified user !" }) } );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while load followers list of the specified user, try later !" });
	}
}

// GET - load following
exports.loadFollowing = async ( req, res ) => {
	const userid = req.params.id;

	try {
		await History.getUserFollowing( userid )
		.then((users) => res.status( 200 ).json({ success: true, data: users }) )
		.catch((error) => res.status( 400 ).json({ succes: false, error: "Failed to get following list of the specified user !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while load following list of the specified user, try later !" });
	}
}