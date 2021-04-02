const Notification = require("../models/notification.model");

exports.loadNotifs = async ( req, res ) => {
	const { userid } = req.body;
	
	try {
		await Notification.getUserNotifications( userid )
		.then( async (data) =>
			res.status( 200 ).json({
				success: true,
				countUnread: await Notification.getCountUnreadNotif( userid ),
				data: JSON.parse( data )
			})
		)
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to load notifications list !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while load notifications list, try later !" });
	}
}

exports.read = async ( req, res ) => {
	const id = req.params.id;
	const { userid } = req.body;

	try {
		await Notification.seenNotifUser( id, userid )
		.then(() => res.status( 200 ).json({ success: true, message: "The specified notif has been read !" }) )
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to read the specified notification !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while read the specified notification, try later !" });
	}
}

exports.readAll = async ( req, res ) => {
	const { userid } = req.body;

	try {
		await Notification.seenAllNotifUser( userid )
		.then(() => res.status( 200 ).json({ success: true, message: "All notifications has been read !" }) )
        .catch(() => res.status( 400 ).json({ success: false, error: "Failed to read all notifications !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while read all notifications, try later !" });
	}
}

exports.delete = async ( req, res ) => {
	const id = req.params.id;
	const { userid } = req.body;

	try {
		await Notification.delNotifUser( id, userid )
		.then(() => res.status( 200 ).json({ success: true, message: "The specified notif has been deleted !" }) )
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to delete the specified notification !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while delete the specified notification, try later !" });
	}
}

exports.deleteAll = async ( req, res ) => {
	const { userid } = req.body;

	try {
		await Notification.delAllNotifUser( userid )
		.then(() => res.status( 200 ).json({ success: true, message: "All notifications has been deleted !" }) )
        .catch(() => res.status( 400 ).json({ success: false, error: "Failed to delete all notifications !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while delete all notifications, try later !" });
	}
}