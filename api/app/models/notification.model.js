const pool = require('../../database/database');

const		findnotif = async ( id, userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT * FROM `notifications` WHERE id = ? AND to_user = ?", [ id, userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( result.length == 0 ? null : result );
			})
		} catch ( e ) {
			reject( e );
		}
	});
}

const		create = async ( notification ) => {
	return new Promise((resolve, reject) => {
		pool.query("INSERT INTO `notifications` ( content, to_user, from_user ) VALUES (?, ?, ?)",
		[ notification.content, notification.to, notification.from ],
		( error, result ) => {
			if ( error ) reject( error );
			else resolve();
		})
	});
}

const		getCountUnreadNotif = async ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT count(*) AS `count` FROM `notifications` WHERE to_user = ? AND seen = 0", [ userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( result[0].count );
			})
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getUserNotifications = async ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT N.id, N.content, N.seen, N.createdAt, N.from_user, U.firstname, U.lastname, U.username,\
				( SELECT url FROM images WHERE images.user_id = N.from_user AND images.profile = 1 ) AS `profile`\
				FROM `notifications` N INNER JOIN `users` U ON U.id = N.from_user\
				WHERE N.to_user = ?\
				ORDER BY N.createdAt DESC", [ userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve( JSON.stringify( result ) );
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		seenNotifUser = async ( id, userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("UPDATE `notifications` SET seen = 1 WHERE id = ? AND to_user = ?", [ id, userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve();
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		seenAllNotifUser = async ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("UPDATE `notifications` SET seen = 1 WHERE to_user = ?", [ userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve();
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		delNotifUser = async ( id, userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("DELETE FROM `notifications` WHERE id = ? AND to_user = ?", [ id, userid ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve();
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		delAllNotifUser = async ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("DELETE FROM `notifications` WHERE to_user = ?", [ userid ],
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
	findnotif,
	create,
	getUserNotifications,
	getCountUnreadNotif,
	seenNotifUser,
	seenAllNotifUser,
	delNotifUser,
	delAllNotifUser
}