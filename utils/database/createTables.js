const path = require("path");
const { db } = require(path.resolve(__dirname, "./connectTestDatabase"));

const Comment = require("./../../models/comment");
const User = require("./../../models/user");

db.serialize(() => {
	db.run(Comment.dropCommentsTable());
	db.run(Comment.dropCommentsVotesTable());
	db.run(User.dropUsersTable());

	db.run(User.createUsersTable(), (err) => {
		if (err) {
			console.log(err);
		}
		console.log("\x1b[34m", "Table users created");
	});

	db.run(Comment.createCommentsTable(), (err) => {
		if (err) {
			console.log(err);
		}
		console.log("\x1b[34m", "Table comments created");
	});

	db.run(Comment.createCommentVotesTable(), (err) => {
		if (err) {
			console.log(err);
		}
		console.log("\x1b[34m", "Table comments_votes created");
	});
});
