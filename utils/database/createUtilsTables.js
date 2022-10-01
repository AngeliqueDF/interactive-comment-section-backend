const path = require("path");

const db = require(path.resolve(
	__dirname,
	"./../../models/database.connection"
)).connectDatabase();

const Comment = require(path.resolve(__dirname, "../../models/comments.model"));
const CommentVotes = require(path.resolve(
	__dirname,
	"../../models/comments.votes.model"
));
const User = require(path.resolve(__dirname, "../../models/user"));

db.serialize(() => {
	db.run(Comment.DROP_COMMENTS_TABLE_QUERY);
	db.run(CommentVotes.DROP_COMMENT_VOTES_TABLE_QUERY);
	db.run(User.DROP_USERS_TABLE_QUERY);

	db.run(User.CREATE_USERS_TABLE_QUERY, (err) => {
		if (err) {
			console.log(err);
		}
		console.log("\x1b[34m", "Table users created");
	});

	db.run(Comment.CREATE_COMMENTS_TABLE_QUERY, (err) => {
		if (err) {
			console.log(err);
		}
		console.log("\x1b[34m", "Table comments created");
	});

	db.run(CommentVotes.CREATE_COMMENT_VOTES_TABLE_QUERY, (err) => {
		if (err) {
			console.log(err);
		}
		console.log("\x1b[34m", "Table comments_votes created");
	});
});
