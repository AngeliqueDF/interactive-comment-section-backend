const path = require("path");

// Modules interacting with the database
const CommentModel = require(path.resolve(__dirname, "./../models/comment"));

// Strips dangerous characters from data received from clients.
const xss = require("xss");

/**
 * Checks the content property is defined in a request body.
 */
function checkMissingContent(req, res, next) {
	if (!req.body.content) {
		const err = new Error();
		err.name = "MissingRequiredField";
		next(err);
	}
	next();
}

/**
 * Sanitizes input and inserts a comment in the database.
 */
async function insertComment(req, res, next) {
	const newComment = {
		user: Number(xss(req.body.user)),
		content: xss(req.body.content),
		score: 0,
		createdAt: new Date(),
		replyingToUser: Number(xss(req.body.replyingToUser)) || null,
		replyingToComment: Number(xss(req.body.replyingToComment)) || null,
	};

	CommentModel.insertOne([
		newComment.user,
		newComment.content,
		newComment.createdAt,
		newComment.score,
		newComment.replyingToComment,
		newComment.replyingToUser,
	])
		.then((newCommentID) => {
			req.body.newComment = { id: newCommentID, ...newComment };
			next();
		})
		.catch((error) => {
			console.trace(error);
			next(error);
		});
}

module.exports = {
	checkMissingContent,
};
