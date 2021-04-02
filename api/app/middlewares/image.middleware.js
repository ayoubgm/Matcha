const Image = require("../models/image.model");

exports.deletePic = async ( req, res, next ) => {
	const { userid } = req.body;
	const imgid = req.params.id;

	try {
		await Image.findOne( imgid, userid )
		.then((found) => {
			if ( !found ) {
				return res.status( 400 ).json({ success: false, error: "The image specified is not found !" });
			} else {
				req.body.url = found.url;
				next();
			}
		})
	} catch ( e ) {
		return res.status( 400 ).json({ error: false, error: "An error has occurred while delete user picture, try later !" });
	}
}