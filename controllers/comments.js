const path = require("path");
const Comment = require(path.resolve(__dirname, "./../models/comment"));

const xss = require("xss");
const validator = require("validator");
const commentsRouter = require("express").Router();

/**
 * Add a new comment
 */
commentsRouter.post(
	"/",
	(req, res, next) => {
		if (!req.body.content) {
			return res.status(400).json({ error: "Missing required field." });
		}
		next();
	},
	async (req, res) => {
		const newComment = {
			user: Number(xss(req.body.user)),
			content: xss(req.body.content),
			createdAt: new Date(),
			replyingToUser: Number(xss(req.body.replyingToUser)) || null,
			replyingToComment: Number(xss(req.body.replyingToComment)) || null,
		};

		try {
			Comment.insertComment([
				newComment.user,
				newComment.content,
				newComment.createdAt,
				newComment.replyingToComment,
				newComment.replyingToUser,
			]);
		} catch (err) {
			console.log(err);
			return res
				.status(500)
				.json({ error: "Could not add this comment. Please try again later" });
		}
	}
);


module.exports = commentsRouter;
