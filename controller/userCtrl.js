const { verifyToken } = require("../config/verifyToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
class UserController {
  static createUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const findUser = await User.findOne({email});
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      throw new Error("Email đã được sử dụng");
    }
  });
  static login = asyncHandler(async (req, res) => {
    const { email , password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });;
      const accessToken = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET,{ expiresIn: "10s" });
      const updateuser = await User.findByIdAndUpdate(
        findUser._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      return res.status(200).json({
        userId: updateuser?._id,
        fullName: updateuser?.fullName,
        email: updateuser?.email,
        accessToken: accessToken
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Tài khoản hoặc mật khẩu không chính xác"
      });
    }
  });
  static refreshToken = asyncHandler(async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
      return res.json({
        refreshToken: refreshToken || 0
      });
  })
}

module.exports = UserController;
