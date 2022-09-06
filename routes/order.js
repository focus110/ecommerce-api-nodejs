const router = require("express").Router();

router.get("/order", (req, res) => {
  res.send("order");
});

module.exports = router;
