const CommentsRouter = require("express").Router();

const CommentsValidator = require("./comments.validators");
const CommentsSanitizer = require("./comments.sanitizer");
const CommentController = require("./comments.controllers");
const CommentsVotesController = require("./comments.votes.controllers");

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

/**
 * Add a new reply
 */
CommentsRouter.post(
	"/newReply",
	CommentController.checkEmptyReply,
	CommentController.setRootComment,
	CommentController.insertComment,
	(req, res) => {
		res.status(201).json(req.body.newComment);
	}
);

/**
 * For all requests to /votes, check whether the new vote is a duplicate.
 */
CommentsRouter.post("/votes", CommentsVotesController.checkDuplicateVote);

module.exports = CommentsRouter;
