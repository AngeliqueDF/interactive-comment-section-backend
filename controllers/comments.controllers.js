const path = require("path");

// Modules interacting with the database
const CommentModel = require(path.resolve(__dirname, "./../models/comment"));

// Strips dangerous characters from data received from clients.
const xss = require("xss");

/**
 * Checks the content property is defined in a request body.
 */
function checkMissingContent(req, res, next) {
	if (!req.body.content) {
		const err = new Error();
		err.name = "MissingRequiredField";
		next(err);
	}
	next();
}

module.exports = {
	checkMissingContent,
};
