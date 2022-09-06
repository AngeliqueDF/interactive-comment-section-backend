const CommentsRouter = require("express").Router();

const CommentController = require("./comments.controllers");

/**
 * Add a new comment
 */
CommentsRouter.post(
	"/",
	CommentController.checkMissingContent,
	CommentController.insertComment,
	CommentController.setRootComment,
	(req, res) => {
		res.status(201).json(req.body.newComment);
	}
);

module.exports = CommentsRouter;
