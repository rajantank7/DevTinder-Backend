const express = require("express");
const app = express();
const port = 3000;

app.listen(3000, () => {
  console.log("server/app is listening on port 3000");
});

app.use("/about", (req, res) => {
  res.send("welcome to about");
});

app.use("/contact", (req, res) => {
  res.send("welcome to contact");
});

app.use("/", (req, res) => {
  res.send("welcome to home");
});
