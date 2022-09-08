/**
 * Trims the comment to only keep the actual content. Avoids duplicated "@username "
 */
function trimContent(username, content) {
	const usernameLength = username.length + 2;
	const trimContent = content.substring(usernameLength, content.length);
	return trimContent;
}

/**
 * Uses recursion to find the root comment of a reply.
 */
const findRootComment = function (allComments, currentCommentID) {
	// Find a comment in the state by its id.
	let currentComment = allComments.find(
		(comment) => comment.id === currentCommentID
	);

	// Once we reach a comment that has null in replyingToComment, we have found the root comment. We can return its id.
	if (currentComment.replyingToComment === null) {
		return currentComment.id;
	}

	// If the current comment is a reply to another comment, call the function again.
	return findRootComment(allComments, currentComment.replyingToComment);
};

module.exports = {
	findRootComment,
	trimContent,
};
