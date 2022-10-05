const path = require("path");
const db = require(path.resolve(
	__dirname,
	"./models/database.connection"
)).connectDatabase();

const Comment = require("./models/comments.model");
const CommentsVotes = require("./models/comments.votes.model");
const User = require("./models/user");

const http = require("http");
const app = require("./app");
const server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server running on port ${process.env.PORT || 5000}`);
	console.log("Please wait while the database is created");

	db.serialize(() => {
		db.run(Comment.DROP_COMMENTS_TABLE_QUERY);
		db.run(CommentsVotes.DROP_COMMENTS_VOTES_TABLE_QUERY);
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

		db.run(CommentsVotes.CREATE_COMMENTS_VOTES_TABLE_QUERY, (err) => {
			if (err) {
				console.log(err);
			}
			console.log("\x1b[34m", "Table comments_votes created");
		});
	});
});
