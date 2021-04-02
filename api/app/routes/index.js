const router = require('express').Router();
const usersRoutes = require('./users.routes');
const tagsRoutes = require('./tags.routes');
const imageRoutes = require('./images.routes');
const historyRoutes = require('./history.routes');
const matchersRoutes = require('./matchers.routes');
const chatRoutes = require("../routes/chat.routes");
const notificationsRoutes = require("./notification.routes");

router
.use("/users", usersRoutes)
.use("/images", imageRoutes)
.use("/tags", tagsRoutes)
.use("/history", historyRoutes)
.use("/matchers", matchersRoutes)
.use("/chat", chatRoutes)
.use("/notifications", notificationsRoutes);

module.exports = router;