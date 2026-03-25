const User = require("../models/users");
const jwt = require("jsonwebtoken");
const secretkey = process.env.SECRET_KEY;

module.exports = {
  VerifyToken: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Token not provided",
        });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Invalid token format",
        });
      }

      const decoded = jwt.verify(token, secretkey);

      const user = await User.findById(decoded._id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.logoutAt && decoded.iat * 1000 < user.logoutAt.getTime()) {
        return res.status(401).json({
          success: false,
          message: "Token expired due to logout",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error: error.message,
      });
    }
  },
};
