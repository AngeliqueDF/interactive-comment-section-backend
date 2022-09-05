const path = require("path");

const Comment = require(path.resolve(__dirname, "./../../../models/comment"));

const statement = db.prepare(Comment.newComment());
const COMMENT = {
	content: "Added by addReply.js",
	user: 2,
	replyingToUser: 1,
	replyingToComment: 1,
};

statement.run([
	COMMENT.user,
	COMMENT.content,
	new Date(),
	COMMENT.score,
	COMMENT.replyingToComment,
	COMMENT.replyingToUser,
]);
