const router = require('express').Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require('../middlewares/user.middleware');
const imageMiddleware = require("../middlewares/image.middleware");
const imageController = require("../controllers/image.controller");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: 'http'
 *       scheme: 'bearer'
 *       bearerFormat: 'JWT'
 *
 * tags:
 *   name: Images
 *   description: All about /api/images
 */

router
  .use("/", authMiddleware.isAuth)
  .put("/profile/upload", imageController.uploadProfilePic)
  .put("/upload", imageController.uploadPic)
  .delete("/delete/:id", imageMiddleware.deletePic, imageController.deletePic);

module.exports = router;

/**
 * @swagger
 *
 * /api/images/profile/upload:
 *   put:
 *     summary: Upload a profile picture
 *     description: Upload profile pic and delete the existing one
 *     tags:
 *       - Images
 *     requestBody:
 *       content:
 *         multipart/form-data::
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: file
 *             example:
 *               profile: File
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfull operation or not
 *                 message:
 *                   type: string
 *                   description: Message of success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Numeric ID of the user
 *                     url:
 *                       type: string
 *                     profile:
 *                       type: boolean
 *                     user_id:
 *                       type: string
 *                       description: User id of the picture
 *                     createdAt:
 *                       type: string
 *                       format: date
 *                       description: Date of creation
 *
 *               example:
 *                 success: true
 *                 message: "Your profile picture has been uploaded successfully !"
 *                 data:
 *                   id: 13
 *                   url: "public/images/users/profile-aguismi-1616591839753-.jpeg"
 *                   profile: 1
 *                   user_id: 34
 *                   createdAt: "2021-03-24T12:17:19.000Z"
 *
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfull operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to upload your profile picture !"
 *
 */

/**
 * @swagger
 *
 * /api/images/upload:
 *   put:
 *     summary: Upload a picture
 *     description: Upload picture
 *     tags:
 *       - Images
 *     requestBody:
 *       content:
 *         multipart/form-data::
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: file
 *             example:
 *               picture: File
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfull operation or not
 *                 message:
 *                   type: string
 *                   description: Message of success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Numeric ID of the user
 *                     url:
 *                       type: string
 *                     profile:
 *                       type: boolean
 *                     user_id:
 *                       type: string
 *                       description: User id of the picture
 *                     createdAt:
 *                       type: string
 *                       format: date
 *                       description: Date of creation
 *
 *               example:
 *                 success: true
 *                 message: "Your picture has been uploaded successfully !"
 *                 data:
 *                   id: 13
 *                   url: "public/images/users/gallery-aguismi-1616591839753-.jpeg"
 *                   profile: 0
 *                   user_id: 34
 *                   createdAt: "2021-03-24T12:17:19.000Z"
 *
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfull operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to upload your picture !"
 *
 */

/**
 * @swagger
 *
 * /api/images/delete/:id:
 *   delete:
 *     summary: Delete a picture by id
 *     description: Delete a picture by id
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the image to delete
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfull operation or not
 *                 message:
 *                   type: string
 *                   description: Message of success
 *               example:
 *                 success: true
 *                 message: "Your picture has been deleted !"
 *
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfull operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to delete your picture !"
 *
 */