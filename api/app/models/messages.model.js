const pool = require('../../database/database');
const { result } = require('lodash');

const findMessage = (message, user_id, chat_id) => {
	return new Promise((resolve, reject) => {
		try {
			pool.query("SELECT * FROM `messages` WHERE message = ? AND user_id = ? AND chat_id = ?", [message, user_id, chat_id],
				(error, result) => {
					if (error) reject(error);
					else resolve(result.length != 0 ? result[0] : null)
				})
		} catch (e) {
			reject(e);
		}
	})
}

const createRoomChat = async (user1, user2) => {
	return new Promise((resolve, reject) => {
		pool.query("INSERT INTO `chat` ( user_id1, user_id2 ) VALUES ( ?, ? )", [user1, user2],
			(error, result) => {
				if (error) reject(error);
				else resolve();
			})
	});
}

const deleteRoomChar = async (user1, user2) => {
	return new Promise((resolve, reject) => {
		pool.query("DELETE FROM `chat` WHERE user_id1 = ? AND user_id2 = ?", [user1, user2],
			(error, result) => {
				if (error) reject(error);
				else resolve();
			})
	})
}

const loadMessagesRoom = (chatid) => {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM `messages` WHERE chat_id = ?", [chatid],
			(error, result) => {
				if (error) reject(error);
				else resolve(JSON.stringify(result));
			})
	})
}

const createMessage = (message) => {
	return new Promise((resolve, reject) => {
		pool.query("INSERT INTO `messages` ( message, user_id, chat_id ) VALUES ( ?, ?, ? )",
			[message.message, message.user_id, message.chat_id],
			async (error, result) => {
				if (error) reject(error);
				else await findMessage(message.message, message.user_id, message.chat_id).then((msg) => { resolve(msg) });
			});
	});
}

module.exports = {
	createRoomChat,
	deleteRoomChar,
	loadMessagesRoom,
	createMessage
}