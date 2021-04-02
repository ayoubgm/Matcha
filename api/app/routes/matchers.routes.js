const router = require('express').Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("../middlewares/user.middleware");
const macthersController = require("../controllers/matchers.controller.js");

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
 *   name: Matchers
 *   description: All about /api/matchers
 */

router
.use("/", authMiddleware.isAuth, userMiddleware.completeInfos )
.get("/list", macthersController.loadMatchers )

module.exports = router;

/**
 * @swagger
 *
 * /api/matchers/list:
 *   get:
 *     summary: Load matchers of a connected user
 *     description: Get users who match with a connected user
 *     tags:
 *       - Matchers
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: boolean
 *                     properties:
 *                       id:
 *                         type: integer
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       profile:
 *                         type: string
 *                         format: date
 *               example:
 *                 success: true
 *                 data:
 *                   - id: 502
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     username: "aguismi"
 *                     profile: "public/images/users/profile-aguismi-16170985722430-.png"
 * 
 *                   - id: 504
 *                     firstname: "user"
 *                     lastname: "test"
 *                     username: "tuser"
 *                     profile: "public/images/users/profile-tuser-1617098572242-.png"
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
 *                 error: "Failed to load matchers list !"
 *
 */