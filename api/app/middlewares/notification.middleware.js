const Notification = require("../models/notification.model");

exports.validateNotif = async ( req, res, next ) => {
	const id = req.params.id;
	const { userid } = req.body;
	
	try {
		await Notification.findnotif( id, userid )
		.then(( notif ) => {
			if ( !notif ) return res.status( 404 ).json({ success: false, error: "The notification is not found !" });
			else next();
		})
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to validate the specified notification to read !" }) )
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate the specified notification, try later !" });
	}
}