const path = require("path");

const CommentsVotesModel = require(path.resolve(
	__dirname,
	"./../models/comments.votes.model"
));

async function checkDuplicateVote(req, res, next) {
	try {
		const alreadyVoted = await CommentsVotesModel.getOne([
			req.body.user,
			req.body.coommentID,
		]);

		if (alreadyVoted.length) {
			const error = new Error("Duplicate vote increment or decrement.");
			error.name = "DuplicateVote";
			next(error);
		}
		next();
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	checkDuplicateVote,
};