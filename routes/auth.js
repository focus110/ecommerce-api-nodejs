const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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

// login user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json("wrong credentials!");

    // destructure password and others
    const { password, ...others } = user._doc;

    // Decrypt password
    const bytes = CryptoJS.AES.decrypt(password, process.env.PASS_SEC);
    const password_ = bytes.toString(CryptoJS.enc.Utf8);

    if (password_ !== req.body.password)
      return res.status(401).json("wrong credentials!");

    const payload = {
      id: user._id,
      isAdmin: user.isAdmin,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SEC, {
      expiresIn: "3d",
    });

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
