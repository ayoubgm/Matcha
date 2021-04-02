const pool = require('../../database/database');

const		getBlacklist = ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("\
				SELECT U.id, U.username, U.gender, U.fame, U.age, U.country, U.city,\
				( SELECT url FROM images WHERE images.user_id = u.id AND images.profile = 1 ) AS `profile`\
				FROM `blockers` B INNER JOIN `users` U ON U.id = B.blocked\
				WHERE B.blocker = ?\
				ORDER BY B.createdAt DESC\
			", [ userid ],
			(error, result) => {
				if ( error ) reject( error );
				else resolve( JSON.stringify( result ) );
			})
		} catch ( e ) {
			reject( e );
		}
	});
}

const		findBlock = ( blocker, blocked ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("\
				SELECT B.*\
				FROM `blockers` B, `users` U\
				WHERE B.blocker - U.id\
				AND B.blocked = U.id\
				AND B.blocker = ?\
				AND B.blocked = ?\
			", [ blocker, blocked ],
			( error, result) => {
				if ( error ) reject( error );
				else resolve( result.length == 0 ? null : result );
			})
		} catch ( e ) {
			reject( e );
		}
	});
}

const		block = ( blocker, blocked ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("INSERT INTO `blockers` ( blocker, blocked ) VALUES ( ?, ? )", [ blocker, blocked ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( result );
			});
		} catch ( e ) {
			reject( e );
		}
	})
}

const		unblock = ( blocker, blocked ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("DELETE FROM `blockers` WHERE blocker = ? AND blocked = ?", [ blocker, blocked ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( result );
			});
		} catch ( e ) {
			reject( e );
		}
	})
}

module.exports = {
	getBlacklist,
	findBlock,
	block,
	unblock
}