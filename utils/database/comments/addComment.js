const path = require("path");
const db = require(path.resolve(
	__dirname,
	"./../../../models/connectUtilsTestDatabase.js"
))();

console.log("Adding a sample comment to the database");

const Comment = require(path.resolve(__dirname, "./../../../models/comment"));

const statement = db.prepare(Comment.newComment());
const COMMENT = {
	content: "Added by addComment.js",
	user: 1,
};

statement.run([
	COMMENT.user,
	COMMENT.content,
	new Date(),
	COMMENT.score,
	COMMENT.replyingToComment,
	COMMENT.replyingToUser,
]);
