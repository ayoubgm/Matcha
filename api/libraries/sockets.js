const jwt = require("jsonwebtoken");
const User = require("../app/models/user.model");
const History = require("../app/models/history.model");
const Notification = require("../app/models/notification.model");
const Message = require("../app/models/messages.model");
const Users = {};

module.exports = (io) => {
	io.on("connection", (socket) => {

		// Event login
		socket.on("login", async (token) => {
			let decoded = jwt.verify(token, process.env.JWT_PKEY);
			// Save socket
			if (!Users[decoded.id]) Users[decoded.id] = [socket];
			else if (!Users[decoded.id].includes(socket)) Users[decoded.id].push(socket);
			// Send notifications
			await Notification.getUserNotifications(decoded.id)
				.then(async (notifications) => {
					socket.broadcast.to(Users[decoded.id][0].id).emit('notifications', {
						'countUnread': await Notification.getCountUnreadNotif(decoded.id),
						'data': JSON.parse(notifications)
					});
				})
			// Update user status
			await User.setStatus(decoded.id);
			socket.emit(`${decoded.id}-online-status`, { online: true });
		});

		// Evenet for reconnect
		socket.on("userConneted", async (token) => {
			let decoded = jwt.verify(token, process.env.JWT_PKEY);

			// Save socket
			if (!Users[decoded.id]) Users[decoded.id] = [socket];
			else if (!Users[decoded.id]?.includes(socket)) Users[decoded.id].push(socket);
			// Update user status
			await User.setStatus(decoded.id);
			socket.emit(`${decoded.id}-online-status`, { online: true });

			socket.on("disconnect", async () => {
				if (Users[socket.decoded]) delete Users[socket.decoded];
				await User.getStatus(socket.decoded).then((status) => {
					socket.emit(`${socket.decoded}-online-status`, { online: false, status });
				});
			});
		});

		// Event is online
		socket.on("isOnline", async (data) => {
			if (Users[data.userid]) {
				socket.emit(`${data.userid}-online-status`, { online: true });
			} else {
				await User.getStatus(data.userid).then((status) => {
					socket.emit(`${data.userid}-online-status`, { online: false, status });
				});
			}
		});

		// Event view
		socket.on("notify", async (data) => {
			switch (data.type) {
				case "view":
					await History.view(data.visitor, data.visited);
					await User.setFamerating(data.visited);
					await Notification.create({ content: "View your profile !", to: data.visited, from: data.visitor });
					break;
				case "like":
					await User.setFamerating(data.visited);
					await Notification.create({ content: "Like your profile !", to: data.visited, from: data.visitor });
					break;
				case "unlike":
					await Notification.create({ content: "Unlike your profile !", to: data.visited, from: data.visitor });
					break;
			}
			// Send notifications
			await Notification.getUserNotifications(data.visited)
			.then(async (notifications) => {
				if (Users[data.visited]) {
					socket.broadcast.to(Users[data.visited][0].id).emit('notifications', {
						'countUnread': await Notification.getCountUnreadNotif(data.visited),
						'data': JSON.parse(notifications)
					});
				}
			});
		});

		socket.on("report", async (data) => {
			// Update fame rating
			await User.setFamerating(data.reported);
		});

		// Event Create and send a message
		socket.on("sendMessage", async (data) => {
			// Save message to database
			await Message.createMessage({ 'message': data.message, 'user_id': data.sender, 'chat_id': data.chat_id })
				.then((message) => {
					if (Users[data.receiver]) {
						socket.broadcast.to(Users[data.receiver][0].id).emit('newMessage', { 'message': message });
					}
				})
			// Create notification the receiver for a new message
			await Notification.create({ content: "Send you a message !", to: data.receiver, from: data.sender });
			await Notification.getUserNotifications(data.receiver)
			.then(async (notifications) => {
				if (Users[data.receiver]) {
					socket.broadcast.to(Users[data.receiver][0].id).emit('notifications', {
						'countUnread': await Notification.getCountUnreadNotif(data.receiver),
						'data': JSON.parse(notifications)
					});
				}
			});
		});

		// Event logout
		socket.on("logout", async (data) => {
			if (Users[data.userid]) {
				delete Users[data.userid];
				await User.getStatus(data.userid).then((status) => {
					socket.emit(`${data.userid}-online-status`, { online: false, status });
				});
			}
		});
	});
};
