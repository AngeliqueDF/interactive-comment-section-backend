const path = require("path");
const Database = require(path.resolve(__dirname, "./database.query.runner"));

// Create comments table
const CREATE_COMMENTS_TABLE_QUERY = `
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    user INTEGER NOT NULL,
    replyingToComment INTEGER DEFAULT NULL,
    replyingToUser INTEGER DEFAULT NULL,
    FOREIGN KEY(user) REFERENCES users(id),
    FOREIGN KEY(replyingToComment) REFERENCES comments(id),
    FOREIGN KEY(replyingToUser) REFERENCES users(id)
  );`;

/**
 * Add a new comment
 */
const NEW_COMMENT_QUERY = `INSERT INTO comments (user, content, createdAt, score,  replyingToComment, replyingToUser) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)`;

/**
 *  Get all comments
 */
const GET_ALL_COMMENTS_QUERY = `SELECT * FROM comments;`;
// Drop comments table
const DROP_COMMENTS_TABLE_QUERY = "DROP TABLE IF EXISTS comments;";


module.exports = {
	CREATE_COMMENTS_TABLE_QUERY,
	insertOne: async function (parameters) {
		const addCommentResult = await Database.addOne(
			NEW_COMMENT_QUERY,
			parameters
		);
		return addCommentResult;
	},
	getAll: async function () {
		const allComments = await Database.getAll(GET_ALL_COMMENTS_QUERY);
		return allComments;
	},
	DROP_COMMENTS_TABLE_QUERY,
};
