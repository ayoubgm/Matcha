const pool = require('../../database/database');

/**
 * 

 */

const findMatchers = async (userid) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT DISTINCT U.id, U.firstname, U.lastname, C.id AS 'chatid',\
				( SELECT url FROM images WHERE images.user_id = U.id AND images.profile = 1 ) AS `profile`\
				FROM `users` U INNER JOIN `matchers` M\
				ON U.id = if( M.matcher = ?, M.matched, M.matcher )\
				INNER JOIN `chat` C ON U.id = C.user_id1 OR U.id = C.user_id2\
				WHERE C.user_id1 = ? OR C.user_id2 = ?", [userid, userid, userid],
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
}
const findMatch = async (matcher, matched) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT * FROM `matchers` where matcher = ? AND matched = ?", [matcher, matched],
				(error, result) => {
					if (error) reject(error);
					else {
						resolve(result.length == 0 ? null : result);
					}
				}
			);
		} catch (e) {
			reject(e);
		}
	});
}

const match = async (matcher, matched) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("INSERT INTO `matchers` (matcher, matched) VALUES (?, ?)", [matcher, matched],
				(error, result) => {
					if (error) reject(error);
					else resolve();
				}
			);
		} catch (e) {
			reject(e);
		}
	});
}

const unmatch = async (matcher, matched) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("DELETE FROM `matchers` WHERE matcher = ? AND matched = ?", [matcher, matched],
				(error, result) => {
					if (error) reject(error);
					else resolve();
				}
			);
		} catch (e) {
			reject(e);
		}
	});
}


module.exports = {
	findMatchers,
	findMatch,
	match,
	unmatch
}