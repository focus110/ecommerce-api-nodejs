const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { authAndCheck } = require("../middleware/auth");

const User = require("../models/User");

// update user
router.put("/:id", authAndCheck, async (req, res) => {
  const password = req.body.password;

  if (password) {
    req.body.password = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
