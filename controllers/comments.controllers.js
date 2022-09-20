const path = require("path");

// Modules interacting with the database
const CommentModel = require(path.resolve(
	__dirname,
	"./../models/comments.model"
));

// Strips dangerous characters from data sent by clients.
const xss = require("xss");

const helper = require("./../utils/helper");

/**
 * Checks the content property is defined in a request body.
 */
function checkEmptyReply(req, res, next) {
	try {
		const trimmedContent = helper.trimContent(
			req.body.newComment.replyingToAuthor,
			req.body.newComment.content
		);

		if (!trimmedContent) {
			const err = new Error();
			err.name = "MissingRequiredField";
			next(err);
		}
		req.body.newComment.content = trimmedContent;
		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Sanitizes input and inserts a comment in the database.
 */
async function insertComment(req, res, next) {
	const newComment = {
		user: Number(xss(req.body.newComment.user)),
		content: xss(req.body.newComment.content),
		score: 0,
		createdAt: new Date(),
		replyingToUser: Number(xss(req.body.newComment.replyingToUser)) || null,
		replyingToComment:
			Number(xss(req.body.newComment.replyingToComment)) || null,
	};

	CommentModel.insertOne([
		newComment.user,
		newComment.content,
		newComment.score,
		newComment.replyingToComment,
		newComment.replyingToUser,
	])
		.then((newCommentID) => {
			req.body.newComment = {
				...newComment,
				id: newCommentID,
				createdAt: helper.formatDate(newComment.createdAt),
			};
			next();
		})
		.catch((error) => {
			console.trace(error);
			next(error);
		});
}

function setRootComment(req, res, next) {
	if (
		req.body.newComment.replyingToComment === null &&
		req.body.newComment.replyingToUser === null
	) {
		next();
	}

	// Find the id of the root comment with recursion
	const rootCommentID = helper.findRootComment(
		req.body.allComments,
		req.body.newComment.replyingToComment
	);

	req.body.newComment = {
		...req.body.newComment,
		replyingToComment: rootCommentID,
	};

	next();
}

/**
 * Populates all comments' replies arrays.
 */
async function getAllComments(req, res, next) {
	try {
		const allComments = await CommentModel.getAll();
		const allCommentsWithReplies = helper.findAllReplies(allComments);

		req.body.allCommentsWithReplies = allCommentsWithReplies.map((comment) => {
			return { ...comment, createdAt: helper.formatDate(comment.createdAt) };
		});
		next();
	} catch (error) {
		console.log(error);
	}
}

async function findCurrentUserVotes(req, res, next) {
	const allUserVotes = await CommentModel.getAllUserVotes();
}

module.exports = {
	checkEmptyReply,
	insertComment,
	setRootComment,
	getAllComments,
};
