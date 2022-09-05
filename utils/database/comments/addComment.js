const path = require("path");

console.log("Adding a sample comment to the database");

const Comment = require(path.resolve(__dirname, "./../../../models/comment"));

console.log("adding comment");
try {
	Comment.insertOne([1, "Added by addComment.js", new Date(), 0]);
	console.log("comment added");
} catch (error) {
	console.log(error);
}
