const path = require("path");

const db = require(path.resolve(
	__dirname,
	"./../../../models/connectUtilsTestDatabase.js"
))();
const Comment = require("./../../../models/comment");

db.all(Comment.getAllComments(), (err, rows) => {
	if (err) {
		console.log(err);
		return err;
	}
	console.log("rows", rows);
});
