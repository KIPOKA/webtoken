require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const posts = [
  {
    username: "Kate",
    title: "Post 1",
  },
  {
    username: "Kat",
    title: "Post 1",
  },
];
// Mock database

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
  console.log(process.env.ACCESS_TOKEN_SECRET);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  // Generate a JWT token
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  // Return the token to the client
  res.status(200).json({ message: "Login successful", token });
});

app.listen(3000);
