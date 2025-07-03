const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const saveUser = await user.save();

    const token = await user.getJwt();
    res.cookie("token", token);

    res.json({
      message: "data added to database successfully",
      data: saveUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("invalid credentials email");
    }

    isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await user.getJwt();

      res.cookie("token", token);
      res.send(user);
    } else throw new Error("invalid credentials password");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("logout sucessfull");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = router;
