const path = require("path");
const CommentsModel = require("../models/comments.model");

const CommentsVotesModel = require(path.resolve(
	__dirname,
	"./../models/comments.votes.model"
));

async function getCommentScore(req, res, next) {
	try {
		const comment = await CommentsModel.getAll([req.body.newVote.commentID]);
		req.body.currentCommentScore = comment[0].score;
		next();
	} catch (error) {
		console.log(error);
		next(error);
	}
}

async function checkDuplicateVote(req, res, next) {
	try {
		const duplicate = await CommentsVotesModel.getOne([
			req.body.newVote.currentUser,
			req.body.newVote.commentID,
		]);

		if (duplicate.length) {
			req.body.duplicateVote = duplicate;
		}

		next();
	} catch (error) {
		console.log(error);
		next(error);
	}
}

async function incrementScore(req, res, next) {
	if (req.body.duplicateVote) {
		// Cancelling the previous increment instead of repeating it
		CommentsModel.decrementScore(req.body.newVote.commentID);

		// Deleting the vote from the comments_votes database
		CommentsVotesModel.delete(req.body.newVote.commentID);
	} else if (!req.body.duplicateVote) {
		CommentsModel.incrementScore(req.body.commentID);
	}
	next();
}

async function insertVote(req, res, next) {
	try {
		if (!req.body.duplicateVote && req.body.newVote.voteGiven === "INCREMENT") {
			CommentsVotesModel.insertOne([
				req.body.newVote.commentID,
				req.body.newVote.currentUser,
				req.body.newVote.voteGiven,
			]);
		}
		next();
	} catch (error) {
		console.log(error);
		next(error);
	}
}

module.exports = {
	getCommentScore,
	checkDuplicateVote,
	incrementScore,
	insertVote,
};
