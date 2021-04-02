const pool = require('../../database/database');

const		findLike = async ( liker, liked ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT * FROM history WHERE type = 'like' AND visitor = ? AND visited = ?", [ liker, liked ],
			(error, result) => {
				if ( error ) reject( error );
				else resolve(( result.length == 0 ) ? null : result);
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getVisitsHistory = async ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT DISTINCT h.visited, u.username, u.firstname, u.lastname, u.gender, u.age, u.fame, u.city, u.country,\
				( SELECT url FROM images WHERE images.user_id = u.id AND images.profile = 1 ) AS `profile`\
				FROM `users` u INNER JOIN `history` h ON u.id = h.visited\
				WHERE h.type = 'view' AND h.visitor = ?\
				GROUP BY h.visited", [ userid ],
				( error, result ) => {
					if ( error ) {
						console.log(error)
						reject( error )
					} else {
						resolve( result );
					}
				});
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getCountViews = ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query('SELECT count( DISTINCT visitor ) AS `views` FROM `history` WHERE type = "view" AND visited = ?', [ userid ],
			( error, result ) => {
				if ( error ) {
					reject( error )
				} else {
					resolve( result.length == 0 ? 0 : result[0].views );
				}
			})
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getCountFollowing = ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query('SELECT count( DISTINCT visited ) AS `following` FROM `history` WHERE type = "like" AND visitor = ?', [ userid ],
			( error, result ) => {
				if ( error ) {
					reject( error )
				} else {
					resolve( result.length == 0 ? 0 : result[0].following );
				}
			})
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getCountFollowers = ( userid ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query('SELECT count( DISTINCT visitor ) AS `followers` FROM `history` WHERE type = "like" AND visited = ?', [ userid ],
			( error, result ) => {
				if ( error ) reject( error )
				else resolve( result.length == 0 ? 0 : result[0].followers )
			})
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getUserViewers = async ( userid ) => {
	return new Promise( async (resolve, reject) => {
		try {
			pool.query(
				"SELECT DISTINCT u.id, u.firstname, u.lastname, u.username, u.gender, u.city, u.country, u.age, u.fame,\
				( SELECT url FROM images WHERE images.user_id = u.id AND images.profile = 1 ) AS `profile`\
				FROM users u INNER JOIN history h\
				ON u.id = h.visitor\
				WHERE h.type = 'view'\
				AND h.visited = ?", [ userid ],
				async ( error, result ) => {
					if ( error ) {
						reject( error );
					} else {
						resolve( JSON.parse( JSON.stringify( result ) ) );
					} 
				}
			);
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getUserFollowers = async ( userid ) => {
	return new Promise( async (resolve, reject) => {
		try {
			pool.query(
				"SELECT DISTINCT u.id, u.firstname, u.lastname, u.username, u.gender, u.city, u.country, u.age, u.fame,\
				( SELECT url FROM images WHERE images.user_id = u.id AND images.profile = 1 ) AS `profile`\
				FROM users u INNER JOIN history h ON u.id = h.visitor\
				WHERE h.type = 'like'\
				AND h.visited = ?", [ userid ],
				async ( error, result ) => {
					if ( error ) reject( error );
					else resolve( JSON.parse( JSON.stringify( result ) ) );
				}
			);
		} catch ( e ) {
			reject( e );
		}
	});
}

const		getUserFollowing = async ( userid ) => {
	return new Promise( async (resolve, reject) => {
		try {
			pool.query("\
				SELECT DISTINCT u.id, u.firstname, u.lastname, u.username, u.gender, u.city, u.country, u.age, u.fame,\
				( SELECT url FROM images WHERE images.user_id = u.id AND images.profile = 1 ) AS `profile`\
				FROM users u INNER JOIN history h ON u.id = h.visited\
				WHERE h.type = 'like' AND h.visitor = ?", [ userid ],
				async ( error, result ) => {
					if ( error ) reject( error );
					else resolve( JSON.parse( JSON.stringify( result ) ) );
				}
			);
		} catch ( e ) {
			reject( e );
		}
	});
}

const		like = async ( liker, liked ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("INSERT INTO `history` (type, visitor, visited) VALUES('like', ?, ?)", [ liker, liked ],
				async ( error, result ) => {
					if ( error ) reject( error );
					else resolve( result );
				}
			)
		} catch ( e ) {
			reject( e );
		}
	})
}

const		view = async ( visitor, visited ) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("INSERT INTO `history` (type, visitor, visited) VALUES('view', ?, ?)", [ visitor, visited ],
				async ( error, result ) => {
					if ( error ) reject( error );
					else resolve( result );
				}
			)
		} catch ( e ) {
			reject( e );
		}
	});
}

const		unlike = ( liker, liked ) => {
	return new Promise((resolve, reject) => {
		pool.query("DELETE FROM `history` WHERE type = 'like' AND visitor = ? AND visited = ?", [ liker, liked ],
			( error, result ) => {
				if ( error ) reject( error );
				else resolve();
			}
		)
	})
}

module.exports = {
	findLike,
	getVisitsHistory,
	getCountFollowers,
	getCountFollowing,
	getCountViews,
	getUserFollowing,
	getUserFollowers,
	getUserViewers,
	view,
	like,
	unlike
}