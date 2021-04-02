const pool = require('../../database/database');


const		find = async () => {
	return new Promise( (resolve, reject) => {
		try {
			pool.query("SELECT * FROM `tags`",
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( JSON.stringify( result ) );
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		findOne = async ( where ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT * FROM `tags` WHERE ?", [ where ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( ( result.length != 0 ) ? { 'id': result[0].id, 'name': result[0].name } : null );
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		findUserTags = async ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT t.* FROM `users_tags` ut INNER JOIN `tags` t INNER JOIN `users` u ON t.id = ut.tag_id AND ut.user_id = u.id WHERE u.id = ?", [ userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( JSON.stringify( result ) );
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		findUserTag = async ( where )  => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT * FROM `users_tags` WHERE tag_id = ? AND user_id = ?", [ where.tag_id, where.user_id ],
			( error, result ) => {
				if ( error )
					reject( error );
				else
					resolve( 
						( result.length == 0 )
						? null
						: JSON.stringify( result[0] )
					);
			});
		} catch ( e ) {
			reject( e );
		}
	});
};

const		save = async ( tag ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("INSERT INTO `tags` SET ?", tag,
			async ( error, result ) => {
				if ( error ) reject( error );
				else await findOne( tag ).then((tag) => resolve( tag ));
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		saveUserTag = async ( userid, tagid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("INSERT INTO `users_tags` ( tag_id, user_id ) VALUES (?,?)", [ tagid, userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( result );
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		deleteUserTag = async ( tagid, userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("DELETE FROM `users_tags` WHERE tag_id = ? AND user_id = ?", [ tagid, userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve();
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		deleteUserTags = async ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("DELETE FROM `users_tags` WHERE user_id = ?", [ userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve();
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

module.exports = {
	findOne,
	find,
	findUserTags,
	findUserTag,
	save,
	saveUserTag,
	deleteUserTags,
	deleteUserTag
}