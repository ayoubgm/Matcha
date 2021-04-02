const Tag = require("../models/tag.model");

const			validateTag = ( tagname ) => {
	return ( !/^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$/.test( tagname ) )
	? new Error(`The tag name must contains only letters or numbers ( ${ tagname } ) !`)
	: (
		( tagname.length < 2 )
		? new Error( `The tag name < ${ tagname } > must be at least 2 letters or numbers !` )
		: (
			( tagname.length > 35 )
			? new Error( `The tag name < ${ tagname } > is too long !` )
			: null
		)
	);
}

const			tagExists = async ( tagname ) => {
	return new Promise( async ( resolve, reject ) => {
		try {
			await Tag.findOne({ 'name': tagname.toLowerCase().trim() })
			.then((tag) => {
				resolve( tag );
			})
			.catch(( error ) => {
				reject( new Error(`Failed to validate tag name specified <${ tagname }> !`) );
			})
		} catch ( e ) {
			reject( new Error(`An error has occurred while tag name specified <${ tagname }>, try later !`) );
		}
	});
}

const			tagUserExists = async ( userid, tagid ) => {
	return new Promise( async ( resolve, reject ) => {
		try {
			await Tag.findUserTag({ 'tag_id': tagid, 'user_id': userid })
			.then((result) => {
				resolve( ( !result ) ? null : JSON.parse( result ) );
			})
			.catch((error) => { reject( error ); });
		} catch ( e ) {
			reject( e );
		}
	});
}

const			isUniqueTag = async ( tagname ) => {
	return new Promise( async ( resolve, reject ) => {
		try {
			await tagExists( tagname )
			.then((tag) => {
				if ( tag ) { reject( new Error( "The tag name already exists !" ) ); }
				else { resolve(); }
			})
		} catch ( e ) {
			reject( new Error(`An error has occurred while validate tag name specified <${ tagname }>, try later !`) );
		}
	});
}

module.exports = {
	validateTag,
	tagExists,
	tagUserExists,
	isUniqueTag
}