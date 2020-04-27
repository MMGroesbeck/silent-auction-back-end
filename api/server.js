const express = require("express");
const cors = require('cors');
const helmet = require('helmet');

const authenticator = require("./authenticator.js");
const usersRouter = require("../users/users-router.js");
const auctionsRouter = require("../auctions/auctions-router.js");
const biddersRouter = require("../bidders/bidders-router");
const watchingRouter = require("../watching/watching-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/users", usersRouter);
server.use("/api/watching", authenticator, watchingRouter);
server.use("/api/bidders", authenticator, biddersRouter);
server.use("/api/auctions", auctionsRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = server;