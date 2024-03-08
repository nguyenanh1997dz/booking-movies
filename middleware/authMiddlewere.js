const User = require('../model/userModel')
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.userId).select("-refreshToken");
        req.user = user?._id;
        next();
      }
    } catch (error) {
      throw new Error("Token hết hạn. đăng nhập");
    }
  } else {
    throw new Error("Không có token, đăng nhập");
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
});

module.exports = {authMiddleware,isAdmin}