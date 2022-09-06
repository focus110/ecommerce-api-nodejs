const router = require("express").Router();

router.get("/product", (req, res) => {
  res.send("product");
});

module.exports = router;
