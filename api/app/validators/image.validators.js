const fs = require("fs");

const			TYPE_IMAGE = { "image/png": "png", "image/jpeg": "jpeg", "image/jpg": "jpg" };
const			MAX_SIZE_PICTURE_GALLERY = 5 * 1024 * 1024; // 5MB
const			MAX_SIZE_PICTURE_PROFILE = 370 * 300;
const			MIN_SIZE_PICTURE = 170 * 100;

const			deleteImage = ( path ) => {
	if ( fs.existsSync( path ) ) fs.rmSync( path );
}

const			fileFilter = ( req, file, cb ) => {
	if ( ! TYPE_IMAGE.hasOwnProperty( file.mimetype ) ) {
		cb( "Invalid file type, only jpeg, jpg or png are allowed !" );
	} else {
		cb( null, true );
	}
}

const			fileSizeFilter = ( profile, gallery ) => {
	return new Promise((resolve, reject) => {
		try {
			if ( typeof profile != 'undefined' ) {
				if ( profile[0].size > MAX_SIZE_PICTURE_PROFILE ) {
					reject( new Error(`The image specified for profile <${ profile[0].originalname }> too large !`) );
				} else if ( profile.size < MIN_SIZE_PICTURE ) {
					reject( new Error(`The image specified for profile <${ profile[0].originalname }> too small !`) );
				}
			}
			if ( typeof gallery != 'undefined' ) {
				gallery.forEach(file => {
					if ( file.size > MAX_SIZE_PICTURE_GALLERY )
						reject( new Error(`The image specified for gallery <${ file.originalname }> too large !`) );
					else if ( file.size < MIN_SIZE_PICTURE )
						reject( new Error(`The image specified for gallery <${ file.originalname }> too small !`) );
				});
			}
			resolve();
		} catch ( e ) {
			reject( new Error( "An error has occurend while validate size pictures, try later !" ) );
		}
	});
}

module.exports = {
	fileFilter,
	fileSizeFilter,
	deleteImage
}