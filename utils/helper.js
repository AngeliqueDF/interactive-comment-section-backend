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
	// console.log(allComments, currentCommentID);
	// Find a comment in the state by its id.
	let currentComment = allComments.find(
		(comment) => comment.id === currentCommentID
	);

	// If the current comment is a reply to another comment...
	if (currentComment.replyingToComment != null) {
		// ...store the other comment's id in currentComment.
		currentComment = currentComment.replyingToComment;
		// Then call the function again
		return findRootComment(currentComment);
	}

	// Once we reach a comment that has null in replyingToComment, we have found the root comment. We can return its id.
	return currentComment.id;
};

module.exports = {
	findRootComment,
	trimContent,
};
