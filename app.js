const express = require("express");
const app = express();
const helmet = require("helmet");
app.use(express.json());

app.use(helmet);
// TODO add sanitizer middleware
module.exports = app;
