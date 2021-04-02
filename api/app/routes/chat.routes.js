const router = require("express").Router();
const chatController = require("../controllers/chat.controller")
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require('../middlewares/user.middleware');

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
 *   name: Chat
 *   description: All about /api/chat
 */

router
.use( "/", authMiddleware.isAuth, userMiddleware.completeInfos )
.get("/messages/:id", chatController.loadMessages )

module.exports = router;