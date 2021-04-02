const pool = require("../../database/database");

const find = async (where) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT * FROM `images` WHERE ?", [where],
				(error, result) => {
					if (error) reject(error);
					else resolve(JSON.stringify(result));
				});
		} catch (e) {
			reject(e);
		}
	});
};

const findOne = async (id, uid) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT * FROM `images` WHERE id = ? AND user_id = ?", [id, uid],
				(error, result) => {
					if (error) reject(error);
					else resolve(!result.length ? null : result[0]);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const findUserImages = async (userid) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT i.* FROM `images` i INNER JOIN `users` u ON u.id = i.user_id WHERE u.id = ?", [userid],
				(error, result) => {
					if (error) reject(error);
					else resolve(JSON.stringify(result));
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const findProfileImage = async (userid) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT * FROM `images` WHERE `profile` = 1 AND user_id = ?", [userid],
				(error, result) => {
					if (error) reject(error);
					else resolve(result.length != 0 ? result[0] : null);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const findPicture = async (userid, url) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query(
				"SELECT * FROM `images` WHERE `profile` = 0 AND user_id = ? AND url = ?", [userid, url],
				(error, result) => {
					if (error) reject(error);
					else resolve(result.length != 0 ? result[0] : null);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const save = async (image) => {
	return new Promise(async (resolve, reject) => {
		try {
			pool.query("INSERT INTO `images` SET ?", image,
				async (error, result) => {
					if (error) reject(error);
					else resolve(image.profile ? await findProfileImage(image.user_id) : await findPicture(image.user_id, image.url))
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};

const deleteProfilePicture = (imgid, userid) => {
	return new Promise((resolve, reject) => {
		pool.query("DELETE FROM `images` WHERE id = ? AND user_id = ?", [imgid, userid],
			(error, result) => {
				if (error) reject(error);
				else resolve();
			});
	});
}

const del = (userid, imgid, isprofile) => {
	return new Promise((resolve, reject) => {
		pool.query("DELETE FROM `images` WHERE id = ? AND user_id = ? AND profile = ?", [imgid, userid, isprofile],
			(error, result) => {
				if (error) reject(error);
				else resolve();
			});
	});
};

module.exports = {
	find,
	findOne,
	findUserImages,
	findProfileImage,
	findPicture,
	save,
	deleteProfilePicture,
	del,
};
