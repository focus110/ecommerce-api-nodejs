const router = require("express").Router();
const { auth } = require("../middleware/auth");

router.get("/usertest", (req, res) => {
  res.send("user");
});

module.exports = router;
