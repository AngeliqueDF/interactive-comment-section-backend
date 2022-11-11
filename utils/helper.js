/**
 * Formats the date in a relative format.
 */
function formatDate(date) {
	const timestamp = new Date(date).getTime();
	const relative = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
	const then = Math.floor(new Date(timestamp));
	const now = new Date();
	const days = (then - now) / 86400000;
	const getRelativeDate = (formatUnit, unitInDays = 1) =>
		relative.format(Math.trunc(days / unitInDays), formatUnit);

	if (days <= -365) {
		return getRelativeDate("year", -365);
	} else if (days <= -30) {
		return getRelativeDate("month", -30);
	} else if (days <= -7) {
		return getRelativeDate("week", -7);
	} else if (days > -7) {
		return getRelativeDate("days");
	}
}

/**
 * Trims the comment to only keep the actual content. Avoids duplicated "@username "
 */
function trimContent(username, content) {
	const usernameLength = username.length + 2;
	const trimContent = content.slice(usernameLength, content.length);
	return trimContent;
}

/**
 * Adds a replies array to all comments. Then populates the same array with the id keys of received replies.
 */
function findAllReplies(allComments) {
	let allCommentsWithReplies = allComments.map((comment) => {
		return { ...comment, replies: [] };
	});

	allCommentsWithReplies.forEach((comment) => {
		if (comment.replyingToComment) {
			const rootCommentIndex = allCommentsWithReplies.findIndex(
				(current) => current.id === comment.replyingToComment
			);

			allCommentsWithReplies[rootCommentIndex].replies.push(comment.id);
		}
	});

	return allCommentsWithReplies;
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

/**
 * For each comment, create and set the voteGiven property to indicate whether the current user has given it a vote (null, "INCREMENT", or "DECREMENT") and which.
 * @returns A new allComments array
 */
function setCurrentUserVotesGiven(allComments, allVotes) {
	return allComments.map((comment) => {
		voteFound = allVotes.find((vote) => vote.comment_id === comment.id);
		return {
			...comment,
			voteGiven: voteFound ? voteFound.vote_given : null,
		};
	});
}

/**
 * Formats the date of each comment object in allComments
 * @returns A new allComments array
 */
function setCommentsCreationDate(allComments) {
	return allComments.map((comment) => {
		return { ...comment, createdAt: formatDate(comment.createdAt) };
	});
}

module.exports = {
	trimContent,
	formatDate,
	findRootComment,
	findAllReplies,
	setCurrentUserVotesGiven,
	setCommentsCreationDate,
};
