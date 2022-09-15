const path = require("path");

const Comment = require("./../../../models/Comment");

db.all(Comment.getAllComments(), (err, rows) => {
	if (err) {
		console.log(err);
		return err;
	}
	console.log("rows", rows);
});
