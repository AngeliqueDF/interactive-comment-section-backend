const CommentsRouter = require("express").Router();

const CommentsValidator = require("./comments.validators");
const CommentsSanitizer = require("./comments.sanitizer");
const CommentController = require("./comments.controllers");
const CommentsVotesController = require("./comments.votes.controllers");

// Validate and sanitize data received from the browser
// WARNING: removing these lines will increase security risks.
CommentsRouter.use(CommentsValidator);
CommentsRouter.use(CommentsSanitizer);

CommentsRouter.delete(
	"/:id",
	CommentController.deleteComment,
	function (req, res) {
		res.status(200).json();
	}
);

CommentsRouter.put(
	"/:id",
	CommentController.updateContent,
	function (req, res) {
		res.status(200).json({ newContent: req.body.newContent });
	}
);

/**
 * Get all comments
 */
CommentsRouter.get("/", CommentController.getAllComments, (req, res) => {
	res.json(req.body.allComments);
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
 * Add a new vote
 */

// Get information about the vote
CommentsRouter.post(
	"/votes/*",
	CommentsVotesController.getCommentScore,
	CommentsVotesController.checkDuplicateVote
);

CommentsRouter.post("/votes/increment", CommentsVotesController.incrementScore);

CommentsRouter.post("/votes/decrement", CommentsVotesController.decrementScore);

CommentsRouter.post(
	"/votes/*",
	CommentsVotesController.insertVote,
	(req, res) => {
		res.status(201).json();
	}
);

module.exports = CommentsRouter;
