const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const accessToken =
    req.headers.authorization?.split(" ")[1] || req.query.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "Access Token is missing" });
  }
  try {
    const decoded = jwt.verify(accessToken, "access_token_secret");
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Access Token" });
  }
};
module.exports = verifyAccessToken;
