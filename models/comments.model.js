const path = require("path");
const Database = require(path.resolve(__dirname, "./database.query.runner"));

/**
 * Create comments table
 */
const CREATE_COMMENTS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS comments (
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

const GET_ONE_COMMENT_QUERY = `SELECT * FROM comments WHERE id = ?;`;

/**
 *  Get all comments
 */
const GET_ALL_COMMENTS_QUERY = `SELECT * FROM comments;`;

/**
 * Add one point to the score of a comment.
 */
const INCREMENT_COMMENT_SCORE = `
 UPDATE comments
 SET 
	 score = score + 1
 WHERE 
	 id = ?`;

/**
 * Remove one point to the score of a comment.
 */
const DECREMENT_COMMENT_SCORE = `
 UPDATE comments
 SET 
		score = score - 1
 WHERE 
	 id = ?`;

const UPDATE_COMMENT_CONTENT = `
	UPDATE comments
	SET
		content = ?
	WHERE
		id = ?`;

const DELETE_COMMENT = `
	DELETE FROM comments
	WHERE id = ?;`;

/**
 * Drop comments table
 */
const DROP_COMMENTS_TABLE_QUERY = "DROP TABLE IF EXISTS comments;";

module.exports = {
	CREATE_COMMENTS_TABLE_QUERY,
	insertOne: async function (parameters) {
		const addCommentResult = await Database.insert(
			NEW_COMMENT_QUERY,
			parameters
		);
		return addCommentResult;
	},
	getOne: async function (parameters) {
		const comment = await Database.get(GET_ONE_COMMENT_QUERY, parameters);
		return comment;
	},
	getAll: async function () {
		const allComments = await Database.get(GET_ALL_COMMENTS_QUERY);
		return allComments;
	},
	incrementScore: async function (parameters) {
		const updatedComment = await Database.update(
			INCREMENT_COMMENT_SCORE,
			parameters
		);
		return updatedComment;
	},
	decrementScore: async function (parameters) {
		const updatedComment = await Database.update(
			DECREMENT_COMMENT_SCORE,
			parameters
		);
		return updatedComment;
	},
	updateComment: async function (parameters) {
		const updatedComment = await Database.update(
			UPDATE_COMMENT_CONTENT,
			parameters
		);
		return updatedComment;
	},
	deleteComment: async function (parameters) {
		const deletedComment = await Database.delete(DELETE_COMMENT, parameters);
		return deletedComment;
	},
	DROP_COMMENTS_TABLE_QUERY,
};
