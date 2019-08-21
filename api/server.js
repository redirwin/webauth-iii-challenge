const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

// next 2 lines help setup session storage to database
const KnexSessionStore = require("connect-session-knex")(session);
const knexConnection = require("../data/db-config");

const authRouter = require("../auth/auth-router");
const restricted = require("../auth/restricted-middleware");

const server = express();

const sessionConfig = {
  name: "session",
  secret: "kiskis",
  object: {
    maxAge: 1000 * 60 * 60 * 3, // lasts for 3 hours
    secure: false, // set to 'true' in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true, // GDPR laws against setting cookies automatically. Set to 'false' in production!
  store: new KnexSessionStore({
    // creates table in database for saving sessions
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60 // clear expired sessions after 1 hour
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/restricted", restricted, authRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "It's working!!" });
});

module.exports = server;
