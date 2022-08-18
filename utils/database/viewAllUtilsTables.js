const path = require("path");
const db = require(path.resolve(
	__dirname,
	"./../../models/connectUtilsTestDatabase"
))();

db.all(`SELECT * FROM users`, (err, rows) => {
	if (err) {
		console.log(err);
	}
	console.log("users table", rows);
});
db.all(`SELECT * FROM comments`, (err, rows) => {
	if (err) {
		console.log(err);
	}
	console.log("comments table", rows);
});
db.all(`SELECT * FROM comment_votes`, (err, rows) => {
	if (err) {
		console.log(err);
	}
	console.log("comment_votes table", rows);
});
