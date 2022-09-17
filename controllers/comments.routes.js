const CommentsRouter = require("express").Router();

const CommentController = require("./comments.controllers");

/**
 * Get all comments
 */
CommentsRouter.get("/", CommentController.getAllComments, (req, res) => {
	res.json(req.body.allCommentsWithReplies);
});

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
	CommentController.checkEmptyReply,
	CommentController.setRootComment,
	CommentController.insertComment,
	(req, res) => {
		res.status(201).json(req.body.newComment);
	}
);

module.exports = CommentsRouter;
