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
let refreshTokens = [];
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token != req.body.token);
  res.sendStatus(204);
});
app.get("/posts", (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
  console.log(process.env.ACCESS_TOKEN_SECRET);
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  // Generate a JWT token
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

app.listen(4000);
