const pool = require("../../database/database");
const Image = require("./image.model");
const Tag = require("./tag.model");
const History = require("./history.model");
const Blockers = require("./blockers.model");
const Matchers = require("../models/matchers.model");
const { prepareUserData } = require("../helpers/helpers");
const { user } = require("../../config/dbconfig");

const findOne = async (where) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT * FROM `users` WHERE ?",
				[where],
				async (error, result) => {
					if (error) reject(error);
					else if (result) {
						resolve(
							result.length == 0
								? null
								: {
									id: result[0].id,
									firstname: result[0].firstname,
									lastname: result[0].lastname,
									email: result[0].email,
									username: result[0].username,
									gender: result[0].gender,
									looking: result[0].looking,
									birthday: result[0].birthday,
									age: result[0].age,
									bio: result[0].bio,
									lang: result[0].lag,
									lat: result[0].lat,
									country: result[0].country,
									city: result[0].city,
									verified: result[0].verified,
									password: result[0].password,
									fame: result[0].fame,
									status: result[0].status,
								}
						);
					}
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const save = async (user) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("INSERT INTO `users` SET ?", user, async (error, result) => {
				if (error) reject(error);
				else
					await findOne({ username: user.username }).then((user) => {
						resolve(user);
					});
			});
		} catch (e) {
			reject(e);
		}
	});
};

const findOneAndUpdate = async (where, updates) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"UPDATE `users` SET ? WHERE ?",
				[updates, where],
				async (error, result) => {
					if (error) {
						reject(error);
					} else {
						if (result.length == 0) resolve(null);
						else
							await findOne({ email: where.email }).then((user) => {
								resolve(user);
							});
					}
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const findNewUsername = async (id, username) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT * from `users` WHERE id <> ? AND username = ? ",
				[id, username],
				(error, result) => {
					if (error) reject(error);
					else resolve(result.length == 0 ? null : result);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const findNewEmail = async (id, email) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT * from `users` WHERE id <> ? AND email = ? ",
				[id, email],
				(error, result) => {
					if (error) reject(error);
					else resolve(result.length == 0 ? null : result);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const loadProfile = async (userid) => {
	return new Promise(async (resolve, reject) => {
		try {
			await findOne({ id: userid }).then(async (user) => {
				if (user) {
					delete user["password"];
					delete user["verified"];
					user.tags = JSON.parse(await Tag.findUserTags(userid));
					user.followers = await History.getCountFollowers(userid);
					user.following = await History.getCountFollowing(userid);
					user.views = await History.getCountViews(userid);
					user.images = JSON.parse(await Image.findUserImages(userid));
					resolve(user);
				} else {
					resolve(null);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

const loadUser = async (where, connuser) => {
	let data;

	return new Promise(async (resolve, reject) => {
		try {
			if (where.id)
				await findOne({ id: where.id }).then(async (user) => {
					data = user ? user : null;
				});
			else
				await findOne({ username: where.username }).then(async (user) => {
					data = user ? user : null;
				});
			if (data) {
				delete data["password"];
				delete data["verified"];
				delete data["email"];
				data.tags = JSON.parse(await Tag.findUserTags(data.id));
				data.images = JSON.parse(await Image.findUserImages(data.id));
				data.followers = await History.getCountFollowers(data.id);
				data.following = await History.getCountFollowing(data.id);
				data.blocked = (await Blockers.findBlock(connuser, data.id))
					? true
					: false;
				data.liked = (await History.findLike(connuser, data.id)) ? true : false;
				data.matched = (await Matchers.findMatch(connuser, data.id))
					? true
					: false;
				resolve(data);
			} else {
				resolve(null);
			}
		} catch (e) {
			reject(e);
		}
	});
};

const findSuggestions = async (user, options) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT U.id, U.firstname, U.lastname, U.username, U.age, U.gender, U.fame, U.country, U.city,\
				ROUND( ST_Distance_Sphere( point(?, ?), point(U.lat, U.lag) ) * 0.001 ) as `distance`,\
				( SELECT count(users_tags.tag_id) from users_tags WHERE users_tags.user_id = U.id and users_tags.tag_id in (SELECT Tag_id from users_tags where users_tags.user_id = ?) ) AS `commonTags`,\
				( SELECT url FROM images WHERE images.user_id = U.id AND images.profile = 1 ) AS `profile`\
				FROM `users` AS U LEFT JOIN `users_tags` AS UT ON U.id = UT.user_id\
				WHERE U.id <> ?\
				AND U.gender = ?\
				AND U.id NOT IN ( SELECT blocked FROM blockers WHERE blocker = ? )\
				AND U.age BETWEEN ? AND ?\
				AND U.fame BETWEEN ? AND ?\
				GROUP BY U.id\
				HAVING `distance` BETWEEN ? AND ?\
				ORDER BY `distance` ASC, `commonTags` DESC, `fame` DESC",
				[
					user.lat,
					user.lang,
					user.id,
					user.id,
					user.looking,
					user.id,
					options.age.min,
					options.age.max,
					options.fame.min,
					options.fame.max,
					options.distance.min,
					options.distance.max,
				],
				async (error, result) => {
					if (error) {
						reject(error);
					} else {
						let users = JSON.stringify(result);

						await prepareUserData(users)
							.then((data) => {
								resolve(data);
							})
							.catch((err) => {
								reject(err);
							});
					}
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const search = (user, options) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT U.id, U.firstname, U.lastname, U.username, U.age, U.gender, U.fame, U.country, U.city, ROUND( ST_Distance_Sphere( point(?, ?), point(U.lat, U.lag) ) * 0.001 ) as `distance`,\
				( SELECT count(users_tags.tag_id) from users_tags WHERE users_tags.user_id = U.id and users_tags.tag_id in (SELECT Tag_id from users_tags where users_tags.user_id = ?) ) AS `commonTags`,\
				( SELECT url FROM images WHERE images.user_id = U.id AND images.profile = 1 ) AS `profile`\
				FROM `users` U\
				WHERE U.id <> ?\
				AND U.id NOT IN ( SELECT blocked FROM `blockers` WHERE blocker = ? )\
				AND U.age BETWEEN ? AND ?\
				AND U.fame BETWEEN ? AND ?",
				[
					user.lat,
					user.lang,
					user.id,
					user.id,
					user.id,
					options.search.age.min,
					options.search.age.max,
					options.search.fame.min,
					options.search.fame.max,
				],
				async (error, result) => {
					if (error) {
						reject(error);
					} else {
						let users = JSON.stringify(result);

						await prepareUserData(users)
							.then((data) => {
								resolve(data);
							})
							.catch((err) => {
								reject(err);
							});
					}
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const getStatus = (userid) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT status FROM `users` WHERE id = ?",
				[userid],
				(error, result) => {
					if (error) reject(error);
					else resolve(result[0]?.status);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const setStatus = (userid) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"UPDATE `users` SET status = NOW() WHERE id = ?",
				[userid],
				(error, result) => {
					if (error) reject(error);
					else resolve();
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const report = async (reported) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"UPDATE `users` SET reports = reports + 1 WHERE id = ?",
				[reported],
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const getCountReports = async (userid) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT reports FROM `users` WHERE id = ?",
				[userid],
				(error, result) => {
					if (error) reject(error);
					else {
						let data = JSON.parse(JSON.stringify(result));
						resolve(!data[0] ? 0 : data[0]?.reports);
					}
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const setFamerating = async (userid) => {
	return new Promise(async (resolve, reject) => {
		let countLikes = await History.getCountFollowers(userid);
		let countViews = await History.getCountViews(userid);
		let countReports = await getCountReports(userid);
		let rate = ((countLikes / 5) + (countViews / 10)) - (countReports / 10);

		try {
			pool.query(
				"UPDATE `users` SET fame = ? WHERE id = ? ",
				[rate, userid],
				(error, result) => {
					if (error) reject(error);
					else resolve();
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const deleteOne = async (where) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("DELETE FROM `users` WHERE ?", [where], (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	save,
	findOne,
	findNewUsername,
	findNewEmail,
	loadProfile,
	loadUser,
	findOneAndUpdate,
	findSuggestions,
	search,
	setFamerating,
	setStatus,
	getStatus,
	report,
	deleteOne,
};
