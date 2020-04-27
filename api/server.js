const express = require("express");
const cors = require('cors');
const helmet = require('helmet');

const authenticator = require("./authenticator.js");
const usersRouter = require("../users/users-router.js");
const biddersRouter = require("../bidders/bidders-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/users", usersRouter);

server.use("/api/bidders", authenticator, biddersRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = server;