const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.token;
  console.log(req.headers.token);
  if (!authHeader) return res.status(401).json("You are not authenticated!");
  const token = authHeader.split(" ")[1];
  jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
    if (err) res.status(403).json("Token is not valid!");
    req.user = user;
    next();
  });
};

const authAndCheck = (req, res, next) => {
  auth(req, res, () => {
    const id = req.user.id;
    const id_ = req.params.id;
    const isAdmin = req.user.isAdmin;

    if (id === id_ || isAdmin) {
      next();
    } else {
      res.status(403).json("Unauthorize");
    }
  });
};

module.exports = { auth, authAndCheck };
