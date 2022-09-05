const path = require("path");

const Comment = require("./../../../models/comment");

Comment.getAllComments().then((allComments) => {
	console.log(allComments);
});
