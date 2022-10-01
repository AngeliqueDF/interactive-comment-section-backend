const path = require("path");

const Comment = require("./../../../models/Comment");

Comment.getAllComments().then((allComments) => {
	console.log(allComments);
});
