const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

// register user
router.post("/register", async (req, res) => {
  // Encrypt req.password
  const password_ = CryptoJS.AES.encrypt(
    req.body.password,
    process.env.PASS_SEC
  ).toString();

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: password_,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
