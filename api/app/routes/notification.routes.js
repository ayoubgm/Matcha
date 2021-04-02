const router = require('express').Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("../middlewares/user.middleware");
const notificationsController = require("../controllers/notification.controller");
const notificationsMiddleware = require("../middlewares/notification.middleware");

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
 *   name: Notifications
 *   description: All about /api/notifications
 */

router
  .use("/", authMiddleware.isAuth)
  .get("/list", notificationsController.loadNotifs)
  .patch("/read/:id", notificationsMiddleware.validateNotif, notificationsController.read)
  .patch("/read", notificationsController.readAll)
  .delete("/delete/:id", notificationsMiddleware.validateNotif, notificationsController.delete)
  .delete("/delete", notificationsController.deleteAll);

/**
 * @swagger
 *
 * /api/notifications/list:
 *   get:
 *     summary: Load user notifications
 *     description: Get notifications of a connected user
 *     tags:
 *       - Notifications
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
 *                       content:
 *                         type: string
 *                       seen:
 *                         type: boolean
 *                       from_user:
 *                         type: integer
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       profile:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                   description: Notifications
 *               example:
 *                 success: true
 *                 data:
 *                   - id: 1
 *                     content: "Like your profile !"
 *                     from_user: 503
 *                     seen: 0
 *                     createdAt: "2021-03-30T10:06:14.000Z"
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     username: "aguismi"
 *                     profile: "public/images/users/profile-aguismi-1617098572242-.png"
 *                   - id: 2
 *                     from_user: 503
 *                     content: "View your profile !"
 *                     seen: 0
 *                     createdAt: "2021-03-30T10:05:59.000Z"
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     username: "aguismi"
 *                     profile: "public/images/users/profile-aguismi-1617098572242-.png"
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
 *                 error: "Failed to load notifications list !"
 *
 */

/**
 * @swagger
 *
 * /api/notifications/read/:id:
 *   patch:
 *     summary: Read a user notification
 *     description: The connected user can read a notification
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the notification to read 
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
 *               example:
 *                 success: true
 *                 message: "The specified notif has been read !"
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
 *                 error: "Failed to validate the specified notification to read !"
 *
 */

/**
 * @swagger
 *
 * /api/notifications/read:
 *   patch:
 *     summary: Read all user notifications
 *     description: The connected user can read all notifications
 *     tags:
 *       - Notifications
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
 *               example:
 *                 success: true
 *                 message: "All notifications has been read !"
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
 *                 error: "Failed to read all notifications !"
 *
 */


/**
 * @swagger
 *
 * /api/notifications/delete/:id:
 *   delete:
 *     summary: Delete a user notification
 *     description: The connected user can delete a notification
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the notification to delete 
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
 *               example:
 *                 success: true
 *                 message: "The specified notif has been deleted !"
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
 *                 error: "Failed to delete the specified notification !"
 *
 */

/**
 * @swagger
 *
 * /api/notifications/delete:
 *   delete:
 *     summary: Delete all user notifications
 *     description: The connected user can delete all notifications
 *     tags:
 *       - Notifications
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
 *               example:
 *                 success: true
 *                 message: "The specified notif has been deleted !"
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
 *                 error: "Failed to delete the specified notification !"
 *
 */

module.exports = router;