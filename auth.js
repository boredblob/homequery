function userAuth(req, res, next) {
  const token = req.headers["token"];
  if (!token) return res.status(403).send("Access Denied: No token given.");
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (decoded.username === req.params.username) {
      next();
    } else {
      return res.status(403).send("Access Denied");
    }
  } catch (err) {
    return res.status(403).send("Access Denied");
  }
}

module.exports.userAuth = userAuth;