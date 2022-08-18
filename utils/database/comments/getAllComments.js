const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
	path.resolve(__dirname, "./../test-database.sqlite"),
	(err) => {
		if (err) {
			console.log(err);
		}
	}
);

const Comment = require("./../../../models/comment");

db.all(Comment.getAllComments(), (err, rows) => {
	if (err) {
		console.log(err);
		return err;
	}
	console.log("rows", rows);
});
