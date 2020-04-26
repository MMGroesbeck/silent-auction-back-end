const express = require("express");
const cors = require('cors');
const helmet = require('helmet');

const usersRouter = require("../users/users-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = server;