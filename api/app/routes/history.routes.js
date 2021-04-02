const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("../middlewares/user.middleware");
const historyController = require("../controllers/history.controller");

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
 *   name: History
 *   description: All about /api/history
 */

router
.use( "/", authMiddleware.isAuth, userMiddleware.completeInfos )
.get("/visits", historyController.visitsHistory )
.get("/user/viewers", historyController.loadViewers )
.get("/user/followers/:id", userMiddleware.findUserById, historyController.loadFollowers )
.get("/user/following/:id", userMiddleware.findUserById, historyController.loadFollowing );

module.exports = router;

/**
 * @swagger
 *
 * /api/history/visits:
 *   get:
 *     summary: Load visits history of a connected user
 *     description: Get visits history of a connected user
 *     tags:
 *       - History
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Numeric ID of the user
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       fame:
 *                         type: integer
 *                         format: flaot
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       profile:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                 
 *               example:
 *                 success: true,
 *                 data:
 *                   - id: 250
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     email: "i.guismi@gmail.com"
 *                     username: "aguismi"
 *                     gender: "male"
 *                     age: 23
 *                     country: "USA"
 *                     city: "Los angles"
 *                     profile: null
 *                     createdAt: "1998-03-09T00:00:00.000Z"
 *                  
 *       400:
 *         description: Bad request
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
 *                 error: "Failed to get your visits history !"
 *       401:
 *         description: Unathorized 
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
 *                 error: "Must complete your profile informations !"
 *
 */

/**
 * @swagger
 *
 * /api/history/user/viewers:
 *   get:
 *     summary: Load a users list who looked on a user (connected user)
 *     description: Viewers of a connected user
 *     tags:
 *       - History
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Numeric ID of the user
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       fame:
 *                         type: integer
 *                         format: flaot
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       profile:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                 
 *               example:
 *                 success: true,
 *                 data:
 *                   - id: 250
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     email: "i.guismi@gmail.com"
 *                     username: "aguismi"
 *                     gender: "male"
 *                     age: 23
 *                     country: "USA"
 *                     city: "Los angles"
 *                     profile: null
 *                     createdAt: "1998-03-09T00:00:00.000Z"
 *                  
 *       400:
 *         description: Bad request
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
 *                 error: "Failed to get your visits history !"
 *       401:
 *         description: Unathorized 
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
 *                 error: "Must complete your profile informations !"
 *
 */

/**
 * @swagger
 *
 * /api/history/user/followers/:id:
 *   get:
 *     summary: Load followers list of a user
 *     description: Get followers of a user by id
 *     tags:
 *       - History
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get 
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Numeric ID of the user
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       fame:
 *                         type: integer
 *                         format: flaot
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       profile:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                 
 *               example:
 *                 success: true,
 *                 data:
 *                   - id: 250
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     email: "i.guismi@gmail.com"
 *                     username: "aguismi"
 *                     gender: "male"
 *                     age: 23
 *                     country: "USA"
 *                     city: "Los angles"
 *                     profile: "public\\images\\users\\profile-aguismi-1616544468470-.jpeg"
 *                     createdAt: "1998-03-09T00:00:00.000Z"
 *                  
 *       400:
 *         description: Bad request, get user infos failed.
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
 *                 error: "Failed to get followers list of the specified user !"
 *       404:
 *         description: Not found 
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
 *                 error: "The user is not found !"
 *       401:
 *         description: Unathorized 
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
 *                 error: "Must complete your profile informations !"
 *
 */

/**
 * @swagger
 *
 * /api/history/user/following/:id:
 *   get:
 *     summary: Load following list of a user
 *     description: Get following of a user by id
 *     tags:
 *       - History
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get 
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Numeric ID of the user
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       fame:
 *                         type: integer
 *                         format: flaot
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       profile:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                 
 *               example:
 *                 success: true,
 *                 data:
 *                   - id: 250
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     email: "i.guismi@gmail.com"
 *                     username: "aguismi"
 *                     gender: "male"
 *                     age: 23
 *                     country: "USA"
 *                     city: "Los angles"
 *                     profile: "public\\images\\users\\profile-aguismi-1616544468470-.jpeg"
 *                     createdAt: "1998-03-09T00:00:00.000Z"
 *                  
 *       400:
 *         description: Bad request
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
 *                 error: "Failed to get following list of the specified user !"
 *       404:
 *         description: Not found 
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
 *                 error: "The user is not found !"
 *       401:
 *         description: Unathorized 
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
 *                 error: "Must complete your profile informations !"
 *
 */