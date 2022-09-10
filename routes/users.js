const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { authAndCheck, authAndAdmin } = require("../middleware/auth");

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

// delete
router.delete("/:id", authAndAdmin, async (req, res) => {
  const id_ = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id_);
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", authAndAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: 1 }).limit(1)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/stats", authAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.setFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.send(500).json(error);
  }
});

module.exports = router;
