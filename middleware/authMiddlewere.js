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
        const user = await User.findById(decoded?.userId);
        if (!user) {
          throw new Error("Người dùng không tồn tại.");
        }
        req.user = user;
        return next();
      }
    } catch (error) {
      console.log(error.name);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token đã hết hạn. Vui lòng đăng nhập lại." });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: "Token không hợp lệ. Vui lòng đăng nhập lại." });
      } else {
        return res.status(500).json({ error: "Đã xảy ra lỗi. Vui lòng đăng nhập lại." });
      }
    }
  } else {
    return res.status(401).json({ error: "Không có token được cung cấp. Vui lòng đăng nhập." });
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