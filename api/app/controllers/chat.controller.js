const Chat = require("../models/messages.model");

exports.loadMessages = async ( req, res ) => {
	const chatid = req.params.id;

	try {
		await Chat.loadMessagesRoom( chatid )
		.then((messages) => res.status( 200 ).json({ success: false, data: JSON.parse( messages ) }) )
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to load messages !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurred while load messages, try later !" });
	}
}