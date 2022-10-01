const Comment = require(path.resolve(
	__dirname,
	"./../../../models/comments.model"
));
Comment.getAll().then((allComments) => {
	console.log(allComments);
});
