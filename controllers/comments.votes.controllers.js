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
	insertVote,
};
