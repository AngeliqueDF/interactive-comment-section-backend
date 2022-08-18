const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(
	path.resolve(__dirname, "./test-database.sqlite"),
	(err) => {
		if (err) {
			console.log(err);
		}
	}
);

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
