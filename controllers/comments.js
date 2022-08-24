const path = require("path");
const { db } = require(path.resolve(
	__dirname,
	"./../models/connectDatabase"
))();
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
	(req, res) => {
		const newComment = {
			user: Number(xss(req.body.user)),
			content: xss(req.body.content),
			createdAt: new Date(),
			replyingToUser: Number(xss(req.body.replyingToUser)) || null,
			replyingToComment: Number(xss(req.body.replyingToComment)) || null,
		};
		const statement = db.prepare(Comment.newComment());

		statement.run(
			[
				newComment.user,
				newComment.content,
				new Date(),
				newComment.score,
				newComment.replyingToComment,
				newComment.replyingToUser,
			],
			(err) => {
				if (err) {
					console.log(err);
					return res
						.status(500)
						.json({ error: "There was an error. Please try again later." });
				}
				res.status(201).json({ ...newComment });
			}
		);
	}
);

module.exports = commentsRouter;
