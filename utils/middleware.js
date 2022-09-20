function errorHandler(err, req, res, next) {
	if (err.name === "ValidationError") {
		return res.status(400).send();
	}
	if (err.name === "MissingRequiredField") {
		return res.status(400).json({ error: "Missing required field(s)." });
	}

	return res
		.status(500)
		.json({ error: "Could not process this request, try again later." });
}

module.exports = { errorHandler };
