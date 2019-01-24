require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const bcrypt = require("bcryptjs"); // added
const jwt = require("jsonwebtoken");
const helpers = require("../middleware/protectedHelper.js");

const protected = helpers.protected;
const roleMW = helpers.checkRole;

const knexConfig = require("../knexfile.js");

const server = express();

const db = knex(knexConfig.development);

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("sanity check");
});

function generateToken(user) {
  const payload = {
    username: user.username,
    name: user.name,
    department: user.department
  };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "10m"
  };
  return jwt.sign(payload, secret, options);
}

server.post("/register", (req, res) => {
  const userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 12);
  userInfo.password = hash;
  db("users")
    .insert(userInfo)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err));
});

server.post("/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // login successful
        // create the token
        const token = generateToken(user);
        res.status(200).json({ message: `welcome ${user.name}`, token });
      } else {
        res.status(401).json({ you: "shall not pass!!" });
      }
    })
    .catch(err => res.status(500).json(err));
});

// protect this endpoint so only logged in users can see it
server.get("/users", protected, async (req, res) => {
  const users = await db("users").select(
    "id",
    "username",
    "name",
    "department"
  );

  res.status(200).json({ users, token: req.decodedToken });
});

server.get("/users/:id", protected, roleMW("admin"), async (req, res) => {
  const user = await db("users")
    .where({ id: req.params.id })
    .first();
});

server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send("you can never leave");
      } else {
        res.status(200).send("bye bye");
      }
    });
  } else {
    res.json({ message: "logged out already" });
  }
});

module.exports = server;
