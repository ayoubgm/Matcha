const User = require("../models/user.model");
const Image = require("../models/image.model");
const { fileFilter, deleteImage } = require("../validators/image.validators");
const { msgsMulterError } = require("../helpers/helpers");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const TYPE_IMAGE = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
};
const MAX_SIZE_PICTURE_GALLERY = 5 * 1024 * 1024;
const MAX_SIZE_PICTURE_PROFILE = 370 * 300;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/images/users");
	},
	filename: async (req, file, cb) => {
		let decoded = jwt.verify(
			req.headers.authorization.split(" ")[1],
			process.env.JWT_PKEY
		);

		await User.findOne({ id: decoded.id }).then((user) => {
			cb(null, file.fieldname + "-" + user.username + "-" + Date.now() + "-" + "." + TYPE_IMAGE[file.mimetype]);
		});
	},
});

const uploadProfile = multer({
	storage: storage,
	limits: { fileSize: MAX_SIZE_PICTURE_PROFILE },
	fileFilter: fileFilter,
}).single("profile");
const uploadPicture = multer({
	storage: storage,
	limits: { fileSize: MAX_SIZE_PICTURE_GALLERY },
	fileFilter: fileFilter,
}).single("picture");

// PUT - Upload a profile picture by a connected user
exports.uploadProfilePic = async (req, res) => {
	const { userid } = req.body;
	let errMsg;

	try {
		// Delete profile picture if exists
		await Image.findProfileImage(userid)
			.then(async (profile) => {
				if (profile) {
					deleteImage(profile);
					await Image.deleteProfilePicture(profile.id, userid)
						.then(() => { })
						.catch((err) => { console.log(err) })
				}
				// Upload new profile picture
				uploadProfile(req, res, async (err) => {
					if (err instanceof multer.MulterError) {
						return res.status(400).json({
							success: false,
							error: msgsMulterError(err.code).message
						});
					} else if (err) {
						return res.status(400).json({
							success: false,
							error: "Failed to upload your profile picture !",
						});
					} else {
						const profile = req.file;

						if (profile) {
							// Update user profile picture
							await Image.save({
								url: profile.path,
								profile: 1,
								user_id: userid,
							}).then((newpic) =>
								res.status(200).json({
									success: true,
									message: "Your profile picture has been uploaded successfully !",
									data: newpic
								})
							);
						} else {
							return res.status(400).json({
								success: false,
								message: "No profile picture has been specified !",
							});
						}
					}
				});
			})
			.catch((error) =>
				res.status(400).json({
					success: false,
					error: "Failed to delete your profile picture !",
				})
			);
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while upload your profile picture, try later !" });
	}
};

// PUT - Upload a picture for gallery by a connected user
exports.uploadPic = async (req, res) => {
	const { userid } = req.body;
	let errMsg;

	try {
		uploadPicture(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				return res.status(400).json({ success: false, error: msgsMulterError(err.code).message });
			} else if (err) {
				return res.status(400).json({ success: false, error: "Failed to upload your picture !" });
			} else {
				const picture = req.file;

				await Image.save({
					url: picture.path,
					profile: 0,
					user_id: userid,
				}).then((newpic) =>
					res.status(200).json({
						success: true,
						message: "Your picture has been uploaded successfully !",
						data: newpic
					})
				);
			}
		});
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while upload your profile picture !" });
	}
};

// DELETE - Delete a picture by owner
exports.deletePic = async (req, res) => {
	const { userid, url } = req.body;
	const imgid = req.params.id;

	try {
		await deleteImage(url);
		await Image.del(userid, imgid, 0)
			.then(() => res.status(200).json({ success: true, message: "Your picture has been deleted !" }))
			.catch(() => res.status(400).json({ success: false, error: "Failed to delete your picture !" }));
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while delete your picture, try later !" });
	}
};
