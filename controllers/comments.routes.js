const CommentsRouter = require("express").Router();

const CommentController = require("./comments.controllers");

/**
 * Add a new comment
 */
CommentsRouter.post(
	"/",
	CommentController.checkMissingContent,
	CommentController.insertComment,
	(req, res) => {
		res.status(201).json(req.body.newComment);
	}
);

module.exports = CommentsRouter;
