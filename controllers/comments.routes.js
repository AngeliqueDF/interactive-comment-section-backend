const CommentsRouter = require("express").Router();

const CommentController = require("./comments.controllers");

/**
 * Add a new comment
 */
CommentsRouter.post(
	"/newComment",
	CommentController.checkMissingContent,
	CommentController.insertComment,
	(req, res) => {
		res.status(201).json(req.body.newComment);
	}
);

CommentsRouter.post(
	"/newReply",
	CommentController.checkMissingContent,
	CommentController.insertComment,
	CommentController.setRootComment,
	(req, res) => {
		res.status(201).json(req.body.newComment);
	}
);

module.exports = CommentsRouter;
