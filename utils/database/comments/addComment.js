/**
 * This script can be used to test adding a new comment and a new reply.
 */

const path = require("path");

const Comment = require(path.resolve(
	__dirname,
	"./../../../models/comments.model"
));

console.log("Launching script to add a sample comment to the database…");
try {
	console.log("Running SQL query…");
	const addedComment = Comment.insertOne([1, "Added by addComment.js", 0]);

	addedComment.then((id) => {
		console.log("Comment added! id: ", id);
	});
} catch (error) {
	console.log(error);
}
