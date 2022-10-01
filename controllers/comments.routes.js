const CommentsRouter = require("express").Router();

const CommentsValidator = require("./comments.validators");
const CommentsSanitizer = require("./comments.sanitizer");
const CommentController = require("./comments.controllers");

// Validate and sanitize data received from the browser
// WARNING: removing these lines will increase security risks.
CommentsRouter.use(CommentsValidator);
CommentsRouter.use(CommentsSanitizer);

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
