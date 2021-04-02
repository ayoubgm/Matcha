const Tag = require("../models/tag.model");

exports.tagsList = async ( req, res ) => {
	try {
		await Tag.find()
		.then((tags) =>
			res.status( 200 ).json({
				success: true,
				data: JSON.parse( tags )
			})
		)
		.catch((error) =>
			res.status( 400 ).json({
				success: false,
				error: "Failed to load tags list !"
			})
		);
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurred while load tags list, try later !"
		});
	}
}