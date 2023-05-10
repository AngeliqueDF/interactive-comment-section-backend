const path = require("path");
const db = require(path.resolve(
	__dirname,
	"./models/database.connection"
)).connectDatabase();

const Comment = require("./models/comments.model");
const CommentsVotes = require("./models/comments.votes.model");
const User = require("./models/user");

function createDatabase() {
	return new Promise(function (resolve, reject) {
		db.serialize(() => {
			db.run(User.CREATE_USERS_TABLE_QUERY, (err) => {
				if (err) {
					console.log(err);
					reject(err);
				}
			});

			db.run(Comment.CREATE_COMMENTS_TABLE_QUERY, (err) => {
				if (err) {
					console.log(err);
					reject(err);
				}
			});

			db.run(CommentsVotes.CREATE_COMMENTS_VOTES_TABLE_QUERY, (err) => {
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			console.log("Database ready");
			resolve();
		});
	});
}

function clearDatabase() {
	return new Promise(function (resolve, reject) {
		db.run(`DELETE FROM comments;`);
		db.run(`DELETE FROM comments_votes;`);
		db.run(`DELETE FROM users;`);
		setTimeout(() => {
			return resolve();
		});
	});
}

module.exports = { createDatabase, clearDatabase };
