const express = require("express");
const app = express();
require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");

const commentsRouter = require("./controllers/comments.routes");

const middleware = require("./utils/middleware");

app.use(helmet());
app.use(express.json());
app.use(cors());

const basicAuth = require("express-basic-auth");

app.use(
	basicAuth({
		users: {
			[`${process.env.REACT_APP_CLIENT_ID}`]: `${process.env.REACT_APP_CLIENT_SECRET}`,
		},
	})
);

app.use("/api/comments", commentsRouter);
app.use(middleware.errorHandler);

module.exports = app;
