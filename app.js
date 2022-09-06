const express = require("express");
const app = express();

const helmet = require("helmet");

const commentsRouter = require("./controllers/comments.routes");

const middleware = require("./utils/middleware");

app.use(helmet());
app.use(express.json());

app.use("/api/comments", commentsRouter);
app.use(middleware.errorHandler);

module.exports = app;
