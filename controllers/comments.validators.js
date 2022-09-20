const { checkSchema, validationResult } = require("express-validator");
const CommentsValidator = require("express").Router();

/**
 * Validate request body when adding a new comment
 */
CommentsValidator.post(
	"/newComment",
	checkSchema({
		"newComment.user": {
			in: ["body"],
			isInt: true,
		},
		"newComment.content": {
			in: ["body"],
			isString: true,
			isLength: { options: { min: 1 } },
		},
	}),
	(req, res, next) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			const error = new Error();
			error.name = "ValidationError";
			next(error);
		}
		next();
	}
);

module.exports = CommentsValidator;
