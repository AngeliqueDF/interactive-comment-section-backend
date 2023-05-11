const { body } = require("express-validator");
const CommentsSanitizer = require("express").Router();

/**
 * Sanitize request body when adding a new comment
 */
CommentsSanitizer.post(
	"/newComment",
	body("newComment.content").trim().escape(),
	(req, res, next) => {
		next();
	}
);

/**
 * Sanitize request body when adding a new reply
 */
CommentsSanitizer.post(
	"/newReply",
	body("newComment.content").trim().escape(),
	body("newComment.replyingToAuthor").trim().escape(),
	(req, res, next) => {
		next();
	}
);

module.exports = CommentsSanitizer;
