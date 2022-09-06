const router = require("express").Router();

router.get("/cart", (req, res) => {
  res.send("cart");
});

module.exports = router;
