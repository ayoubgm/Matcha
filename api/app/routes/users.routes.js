const router = require('express').Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require('../middlewares/user.middleware');
const userController = require('../controllers/user.controller');

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
 *   name: Users
 *   description: All about /api/users
 */

router
.use("/find", authMiddleware.isAuth, userMiddleware.completeInfos )
.use("/edit", authMiddleware.isAuth, userMiddleware.completeInfos )
.get("/find/suggestions", userController.browsing )
.get("/find/profile", userController.profileInfos )
.get("/find/user/id/:id", userMiddleware.findUserById, userController.findUserById )
.get("/find/user/username/:username", userMiddleware.findUserByUsername, userController.findUserByUsername )
.get("/verify/isinfoscompleted", authMiddleware.isAuth, userController.isinfoscompleted )
.get("/find/black/list", userController.blacklist )
.get("/get/status/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userController.getStatus )
.post("/verify/token", userController.verifyToken )
.post("/register", userMiddleware.register, userController.register )
.post("/register/google", userMiddleware.registerGoogle, userController.registerGoogle )
.post("/login", userMiddleware.login, userController.login )
.post("/logout", authMiddleware.isAuth, userController.logout )
.post("/auth/google", userMiddleware.authGoogle, userController.authGoogle )
.post("/resetpassword", userMiddleware.resetPassword, userController.resetPassword )
.post("/search", authMiddleware.isAuth, userMiddleware.completeInfos, userController.search )
.put("/like/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.like, userMiddleware.likedBack, userController.like )
.put("/unlike/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.unlike, userMiddleware.isMatch, userController.unlike )
.put("/block/:blocked", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.block, userController.block )
.put("/unblock/:unblocked", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.unblock, userController.unblock )
.put("/report/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.report, userController.report )
.patch("/verify", userMiddleware.verify, userController.verify )
.patch("/newpassword", userMiddleware.newPassword, userController.newPassword )
.patch("/completeinfos", authMiddleware.isAuth, userMiddleware.isProfileCompleted, userController.completeInfos )
.patch("/edit/informations", userMiddleware.editInfos, userController.editInfos )
.patch("/edit/password", userMiddleware.changepassword, userController.changepassword )
.patch("/edit/location", userMiddleware.editLocation, userController.editLocation )
.patch("/update/status", authMiddleware.isAuth, userMiddleware.completeInfos, userController.setStatus );

module.exports = router;

/**
 * @swagger
 *
 * /api/users/register:
 *   post:
 *     summary: Register
 *     description: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: User's firstname
 *                 required: true
 *                 min: 3
 *                 max: 30
 *               lastname:
 *                 type: string
 *                 description: User's lastname
 *                 required: true
 *                 min: 3
 *                 max: 30
 *               email:
 *                 type: string
 *                 description: User's email
 *                 required: true
 *                 unique: true
 *               username:
 *                 type: string
 *                 description: User's username
 *                 required: true
 *                 unique: true
 *                 min: 3
 *                 max: 20
 *               password:
 *                 type: string
 *                 description: User's password
 *                 required: true
 *               confirmpassword:
 *                 type: string
 *                 description: password confirmation 
 *                 required: true
 *             example:
 *               firstname: "test"
 *               lastname: "user"
 *               email: "testUser@gmail.ma"
 *               username: "testUser0"
 *               password: "test_User00"
 *               confirmpassword: "test_User00"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Created, Successufull operation
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
 *                 message: "Successfull registration !"
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
 *                 error: "Registration failed !"
 *
 */

/**
 * @swagger
 *
 * /api/users/register/google:
 *   post:
 *     summary: Register with google account
 *     description: Create a new account
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleid:
 *                 type: string
 *                 description: User account google id
 *                 required: true
 *               tokenid:
 *                 type: string
 *                 description: User account token id
 *                 required: true
 *             example:
 *               tokenid: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoiYWd1aXNtaSIsImlhdCI6MTU5MTk5MDQ4Mn0.spqNQLT_AVzKCi7_nryBk3CzYtP_540AJLxJ41bWrJA"
 *               googleid: "115064340704113209584"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Created, Successufull operation
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
 *                 message: "Successfull registration !"
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
 *                 error: "Can't create an account with your googe account, try later !"
 *
 */

/**
 * @swagger
 *
 * /api/users/login:
 *   post:
 *     summary: Login
 *     description: User can login with username and password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 required: true
 *                 min: 6
 *                 max: 12
 *               password:
 *                 type: string
 *                 description: User's password
 *                 required: true
 *                 min: 8
 *             example:
 *               username: "testUser0"
 *               password: "test_User00"
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
 *                 isInfosComplete:
 *                   type: boolean
 *                   description: Is the user complete his informations or not
 *                 token:
 *                   type: string
 *                   description: User's token by jwt
 *               example:
 *                 success: true
 *                 message: "You have been logged in successfully !"
 *                 isInfosComplete: true
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoiYWd1aXNtaSIsImlhdCI6MTU5MTk5MDQ4Mn0.spqNQLT_AVzKCi7_nryBk3CzYtP_540AJLxJ41bWrJA"
 *
 *       400:
 *         description: Bad request, username or password incorrect.
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
 *                 error: "The username or password is incorrect !"
 *
 *       401:
 *         description: Unauthorized, must sign in with activated account.
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
 *                 error: "You must confirm your account first !"
 *
 */

/**
 * @swagger
 *
 * /api/users/auth/google:
 *   post:
 *     summary: Login with google account
 *     description: User can login with his google account
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleid:
 *                 type: string
 *                 description: User account google id
 *                 required: true
 *               tokenid:
 *                 type: string
 *                 description: User account token id
 *                 required: true
 *             example:
 *               tokenid: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoiYWd1aXNtaSIsImlhdCI6MTU5MTk5MDQ4Mn0.spqNQLT_AVzKCi7_nryBk3CzYtP_540AJLxJ41bWrJA"
 *               googleid: "115064340704113209584"
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
 *                 isInfosComplete:
 *                   type: boolean
 *                   description: Is the user complete his informations or not
 *                 token:
 *                   type: string
 *                   description: User's token by jwt
 *               example:
 *                 success: true
 *                 message: "You have been logged in successfully !"
 *                 isInfosComplete: true
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoiYWd1aXNtaSIsImlhdCI6MTU5MTk5MDQ4Mn0.spqNQLT_AVzKCi7_nryBk3CzYtP_540AJLxJ41bWrJA"
 *
 *       400:
 *         description: Bad request, username or password incorrect.
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
 *                 error: "The username or password is incorrect !"
 *
 *       401:
 *         description: Unauthorized, must sign in with activated account.
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
 *                 error: "You must confirm your account first !"
 *
 */

/**
 * @swagger
 *
 * /api/users/resetpassword:
 *   post:
 *     summary: Reset password
 *     description: User can reset his password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 required: true
 *             example:
 *               email: "testUser0@gmail.com"
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
 *                 message: "A reset password link sent to your email !"
 *
 *       400:
 *         description: Bad request, can't send reset password link
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
 *                 error: "Failed to reset password link !"
 *
 */

/**
 * @swagger
 *
 * /api/users/find/suggestions:
 *   get:
 *     summary: Load suggestions list for a a user
 *     description: Load users that match ac connected user
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: minage
 *         schema:
 *           type: integer
 *         description: Min age
 *       - in: query
 *         name: maxage
 *         schema:
 *           type: integer
 *         description: Max age
 *       - in: query
 *         name: mind
 *         schema:
 *           type: integer
 *         description: Min distance
 *       - in: query
 *         name: maxd
 *         schema:
 *           type: integer
 *         description: Max distance
 *       - in: query
 *         name: minfame
 *         schema:
 *           type: integer
 *         description: Min fame
 *       - in: query
 *         name: maxfame
 *         schema:
 *           type: integer
 *         description: Max fame
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
 *                 users:
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
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             url:
 *                               type: string
 *                       fame:
 *                         type: integer
 *                         format: float
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       distance:
 *                         type: integer
 *                       commonTags:
 *                         type: integer
 *                       profile:
 *                         type: string
 *               example:
 *                 success: true,
 *                 users:
 *                   - id: 1
 *                     firstname: "Blondie"
 *                     lastname: "Gallahue"
 *                     username: "bgallahue0"
 *                     age: 18
 *                     gender: "female"
 *                     fame: 14
 *                     country: "Morocco"
 *                     city: "Khouribga"
 *                     distance: 6
 *                     commonTags: 0
 *                     profile: null
 *                   - id: 5
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     username: "aguismi"
 *                     gender: "male"
 *                     fame: 50
 *                     age: 23
 *                     country: "USA"
 *                     city: "Los angles"
 *                     distance: 6
 *                     commonTags: 0
 *                     profile: null
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
 *                 error: "Failed to load suggestions list !"
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
 * /api/users/search:
 *   post:
 *     summary: Search on users
 *     description: Load users list wth one or more criterias
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minage:
 *                 type: number
 *                 description: Min age
 *               maxage:
 *                 type: number
 *                 description: Max age
 *               minfame:
 *                 type: number
 *                 description: Min fame
 *               maxfame:
 *                 type: number
 *                 description: Max fame
 *     parameters:
 *       - in: query
 *         name: minage
 *         schema:
 *           type: integer
 *         description: Min age
 *       - in: query
 *         name: maxage
 *         schema:
 *           type: integer
 *         description: Max age
 *       - in: query
 *         name: mind
 *         schema:
 *           type: integer
 *         description: Min distance
 *       - in: query
 *         name: maxd
 *         schema:
 *           type: integer
 *         description: Max distance
 *       - in: query
 *         name: minfame
 *         schema:
 *           type: integer
 *         description: Min fame
 *       - in: query
 *         name: maxfame
 *         schema:
 *           type: integer
 *         description: Max fame
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
 *                 users:
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
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             url:
 *                               type: string
 *                       fame:
 *                         type: integer
 *                         format: float
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       distance:
 *                         type: integer
 *                       commonTags:
 *                         type: integer
 *                       profile:
 *                         type: string
 *               example:
 *                 success: true,
 *                 users:
 *                   - id: 1
 *                     firstname: "Blondie"
 *                     lastname: "Gallahue"
 *                     username: "bgallahue0"
 *                     age: 18
 *                     gender: "female"
 *                     fame: 14
 *                     country: "Morocco"
 *                     city: "Khouribga"
 *                     distance: 6
 *                     commonTags: 0
 *                     profile: null
 *                   - id: 5
 *                     firstname: "ayoub"
 *                     lastname: "guismi"
 *                     username: "aguismi"
 *                     gender: "male"
 *                     fame: 50
 *                     age: 23
 *                     country: "USA"
 *                     city: "Los angles"
 *                     distance: 6
 *                     commonTags: 0
 *                     profile: null
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
 *                 error: "Failed to load search list !"
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
 * /api/users/find/user/id/:id:
 *   get:
 *     summary: Load informations about a user by id
 *     description: Get informations about a user by id
 *     tags:
 *       - Users
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
 *                 id:
 *                   type: integer
 *                   description: Numeric ID of the user
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 looking:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *                 age:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                 lang:
 *                   type: string
 *                 lat:
 *                   type: string
 *                 country:
 *                   type: string
 *                 city:
 *                   type: string
 *                 followers:
 *                   type: integer
 *                 following:
 *                   type: integer
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                       profile:
 *                         type: boolean
 *                       cover:
 *                         type: boolean
 *                       user_id:
 *                         type: integer
 *                       createdAt:
 *                         type: date
 *                 status:
 *                   type: string
 *                   format: date
 *                 liked:
 *                   type: boolean
 *                 matched:
 *                   type: boolean
 *               example:
 *                  id: 250
 *                  firstname: "ayoub"
 *                  lastname: "guismi"
 *                  email: "i.guismi@gmail.com"
 *                  username: "aguismi"
 *                  gender: "male"
 *                  looking: "female"
 *                  birthday: "1998-03-09T00:00:00.000Z"
 *                  age: 23
 *                  bio: "sdjshds djns djnsdsdksdsd"
 *                  tags:
 *                    - id: 1
 *                      name: "42"
 *                    - id: 2
 *                      name: "1337"
 *                  lang: -90
 *                  lat: 180
 *                  country: "USA"
 *                  city: "Los angles"
 *                  followers: 2
 *                  following: 2
 *                  images:
 *                   - id: 1
 *                     url: "public/images/users/profile-aguismi-1615887176815.png"
 *                     profile: 1
 *                     cover: 0
 *                     user_id: 250
 *                     createdAt: "2021-03-16T08:32:56.000Z"
 *                   - id: 2
 *                     url: "public/images/users/gallery-aguismi-1615887176820.jpeg"
 *                     profile: 0
 *                     cover: 0
 *                     user_id: 250
 *                     createdAt: "2021-03-16T08:32:56.000Z"
 *                  status: "2021-03-15T14:18:19.000Z"
 *                  blocked: false
 *                  liked: true
 *                  matched: true
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
 *                 error: "Failed to load informations about the specified user !"
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
 * /api/users/find/user/username/:username:
 *   get:
 *     summary: Load informations about a user by username
 *     description: Get informations about a user by username
 *     tags:
 *       - Users
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
 *                 id:
 *                   type: integer
 *                   description: Numeric ID of the user
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 looking:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *                 age:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                 lang:
 *                   type: string
 *                 lat:
 *                   type: string
 *                 country:
 *                   type: string
 *                 city:
 *                   type: string
 *                 followers:
 *                   type: integer
 *                 following:
 *                   type: integer
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                       profile:
 *                         type: boolean
 *                       cover:
 *                         type: boolean
 *                       user_id:
 *                         type: integer
 *                       createdAt:
 *                         type: date
 *                 status:
 *                   type: string
 *                   format: date
 *                 blocked:
 *                   type: boolean
 *                 liked:
 *                   type: boolean
 *                 matched:
 *                   type: boolean
 *               example:
 *                  id: 250
 *                  firstname: "ayoub"
 *                  lastname: "guismi"
 *                  email: "i.guismi@gmail.com"
 *                  username: "aguismi"
 *                  gender: "male"
 *                  looking: "female"
 *                  birthday: "1998-03-09T00:00:00.000Z"
 *                  age: 23
 *                  bio: "sdjshds djns djnsdsdksdsd"
 *                  tags:
 *                    - id: 1
 *                      name: "42"
 *                    - id: 2
 *                      name: "1337"
 *                  lang: -90
 *                  lat: 180
 *                  country: "USA"
 *                  city: "Los angles"
 *                  followers: 2
 *                  following: 2
 *                  images:
 *                   - id: 1
 *                     url: "public/images/users/profile-aguismi-1615887176815.png"
 *                     profile: 1
 *                     cover: 0
 *                     user_id: 250
 *                     createdAt: "2021-03-16T08:32:56.000Z"
 *                   - id: 2
 *                     url: "public/images/users/gallery-aguismi-1615887176820.jpeg"
 *                     profile: 0
 *                     cover: 0
 *                     user_id: 250
 *                     createdAt: "2021-03-16T08:32:56.000Z"
 *                  status: "2021-03-15T14:18:19.000Z"
 *                  blocked: false
 *                  liked: true
 *                  matched: true
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
 *                 error: "Failed to load informations about the specified user !"
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
 * /api/users/find/profile:
 *   get:
 *     summary: Load informations about a connected user
 *     description: Get profile infos by connected user
 *     tags:
 *       - Users
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
 *                 id:
 *                   type: integer
 *                   description: Numeric ID of the user
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 looking:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *                 age:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                       profile:
 *                         type: boolean
 *                       cover:
 *                         type: boolean
 *                       user_id:
 *                         type: integer
 *                       createdAt:
 *                         type: date
 *                 lang:
 *                   type: string
 *                 lat:
 *                   type: string
 *                 country:
 *                   type: string
 *                 city:
 *                   type: string
 *                 followers:
 *                   type: integer
 *                 following:
 *                   type: integer
 *                 views:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   format: date
 *               example:
 *                  id: 250
 *                  firstname: "ayouh"
 *                  lastname: "guismi"
 *                  email: "i.guismi@gmail.com"
 *                  username: "aguismi"
 *                  gender: "male"
 *                  looking: "female"
 *                  bio: "sdjshds djns djnsdsdksdsd"
 *                  birthday: "1998-03-09T00:00:00.000Z"
 *                  age: 23
 *                  tags:
 *                    - id: 1
 *                      name: "42"
 *                    - id: 2
 *                      name: "1337"
 *                  images:
 *                   - id: 1
 *                     url: "public/images/users/profile-aguismi-1615887176815.png"
 *                     profile: 1
 *                     cover: 0
 *                     user_id: 250
 *                     createdAt: "2021-03-16T08:32:56.000Z"
 *                   - id: 2
 *                     url: "public/images/users/gallery-aguismi-1615887176820.jpeg"
 *                     profile: 0
 *                     cover: 0
 *                     user_id: 250
 *                     createdAt: "2021-03-16T08:32:56.000Z"
 *                  lang: -90
 *                  lat: 180
 *                  country: "USA"
 *                  city: "Los angles"
 *                  status: "2021-03-15T14:18:19.000Z"
 *                  views: 2
 *                  followers: 3
 *                  following: 2
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
 *                 error: "Failed to load profile informations !"
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
 * /api/users/verify/isinfoscompleted:
 *   get:
 *     summary: Load informations about if the user complete his informations or not
 *     tags:
 *       - Users
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
 *                 complete:
 *                   type: boolean
 *                   description: Complete his informations or not
 *                 userif:
 *                   type: integer
 *                   description: User id
 *                 username:
 *                   type: string
 *                   description: Username
 *               example:
 *                 success: true
 *                 complete: false
 *                 id: 1
 *                 username: "aguismi"
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
 *                 error: "Failed to load profile informations !"
 *
 */

/**
 * @swagger
 *
 * /api/users/find/black/list:
 *   get:
 *     summary: Load black list of a user
 *     description: Load users that has been blocked by the connected user
 *     tags:
 *       - Users
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
 *                 error: "Failed to load your blacklist !"
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
 * /api/users/verify:
 *   patch:
 *     summary: Activation account
 *     description: User can activate his own account by a link send to his email after registration
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's token to activate account
 *                 required: true
 *             example:
 *               token: "6bb28d9cd04526c47be2cbb042737a20398bfd7ba10de3f3d61cb034b0adfc8c769966900891d85db9200da31cbb7246ecc1214fecbb92027162f6a221eabc3a"
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
 *                 message: "Your account has been successfully activated !"
 *
 *       400:
 *         description: Bad request, failed to activate account
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
 *                 error: "Activation token is invalid or the account already activated !"
 *
 */

/**
 * @swagger
 *
 * /api/users/newpassword:
 *   patch:
 *     summary: New password
 *     description: User can change password after reset account via reset password link 
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's token to activate account
 *                 required: true
 *               newpassword:
 *                 type: string
 *                 description: User's new password
 *                 required: true
 *               confirmpassword:
 *                 type: string
 *                 description: password confirmation 
 *                 required: true
 *             example:
 *               token: "6bb28d9cd04526c47be2cbb042737a20398bfd7ba10de3f3d61cb034b0adfc8c769966900891d85db9200da31cbb7246ecc1214fecbb92027162f6a221eabc3a"
 *               newpassword: "test_User00"
 *               confirmpassword: "test_User00"
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
 *                 message: "Your password has been changed !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "Failed to change your password !"
 *
 */

/**
 * @swagger
 *
 * /api/users/completeinfos:
 *   patch:
 *     summary: Complete user informations
 *     description: User can complete user infos after login 
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 required: true
 *                 enum: ["female", "male", "other"]
 *               looking:
 *                 type: string
 *                 required: true
 *                 enum: ["female", "male", "other"]
 *               bio:
 *                 type: string
 *                 min: 10
 *                 max: 100
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               lat:
 *                 type: number
 *                 format: float
 *                 min: -180
 *                 max: 180
 *               lang:
 *                 type: number
 *                 format: float
 *                 min: -90
 *                 max: 90
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               profile:
 *                 type: file
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: file
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
 *               example:
 *                 success: true
 *                 message: "Your informations has been completed successfully !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "Failed to complete your informations !"
 *
 */

/**
 * @swagger
 *
 * /api/users/edit/informations:
 *   patch:
 *     summary: Update user informations
 *     description: User can update informationsn
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               looking:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
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
 *                 message: "Your informations has been updated successfully !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "Failed to edit your informations, try later !"
 * 
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
 * /api/users/edit/password:
 *   patch:
 *     summary: Update user password
 *     description: User can update his password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldpassword:
 *                 type: string
 *               newpassword:
 *                 type: string
 *               confirmpassword:
 *                 type: string
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
 *                 message: "Your password has been changed successfully !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "The old password is incorrect !"
 * 
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
 */

/**
 * @swagger
 *
 * /api/users/edit/location:
 *   patch:
 *     summary: Update user location
 *     description: User can update his location
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: string
 *               lang:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
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
 *                 message: "Your location has been updated successfully !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "Failed to edit your location !"
 * 
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
 * /api/users/like/:id:
 *   put:
 *     summary: Like a user
 *     description: User can like another user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to like
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
 *                 message: "Liked successfully !"
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
 *                 error: "Failed to like the specified user !"
 * 
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
 * /api/users/unlike/:id:
 *   put:
 *     summary: Unlike a user
 *     description: User can unlike another user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to unlike
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
 *                 message: "Unliked successfully !"
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
 *                 error: "Failed to unlike the specified user !"
 * 
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
 * /api/users/block/:blocked:
 *   put:
 *     summary: Block a user
 *     description: User can block a another user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: blocked
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to block
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
 *                 message: "Blocked successfully !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "Failed to block the specified user, try later !"
 * 
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
 * /api/users/unblock/:unblocked:
 *   put:
 *     summary: Unblock a user
 *     description: User can unblock a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: unblocked
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to unblock
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
 *                 message: "Unblocked successfully !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "Failed to unblock the specified user, try later !"
 * 
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
 * /api/users/report/:id:
 *   put:
 *     summary: Unblock a user
 *     description: User can unblock a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to report
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
 *                 message: "Reported succssfully !"
 *
 *       400:
 *         description: Bad request, failed to change to new password
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
 *                 error: "Failed to report the specified user !"
 * 
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
 */