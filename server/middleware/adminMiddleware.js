const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Admin privileges required",
      });
    }
    next();
  } catch (error) {
    console.error("Error in adminMiddleware:", error);
    res.status(500).json({
      success: false,
      message: "Authentication server error",
    });
  }
};

module.exports = adminMiddleware;
