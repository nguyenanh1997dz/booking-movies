const { verifyToken } = require("../config/verifyToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloundiary");

class UserController {
  static createUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      throw new Error("Email đã được sử dụng");
    }
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = jwt.sign(
        { userId: findUser._id },
        process.env.JWT_SECRET
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      const accessToken = jwt.sign(
        { userId: findUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );
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
        accessToken: accessToken,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
  });

  static logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken)
      throw new Error("không có refreshToken trong cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  });

  static getAllUser = asyncHandler(async (req, res) => {
    try {
      const getAllUser = await User.find();
      res.status(200).json({
        message: "Thành công",
        data: getAllUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  static getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const getaUser = await User.findById(id);
      res.status(200).json({
        message: "Thành công",
        data: getaUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  static updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password} = req.body; 
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }
      if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
      }
    } catch (error) {
      res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật thông tin người dùng." });
    }
  })
  

  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deleteaUser = await User.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa thành công",
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  static refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      return res
        .status(403)
        .json({
          message: "Không có refreshToken trong cookie. Vui lòng đăng nhập lại",
        });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res
        .status(403)
        .json({
          message:
            "Không tìm thấy refreshToken trong cơ sở dữ liệu. Vui lòng đăng nhập lại",
        });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  });

  static blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const blockUser = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "Khóa tài khoản thành công",
        data: blockUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  static unBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const unBlockUser = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "Mở khóa tài khoản thành công",
        data: unBlockUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi khi lấy dữ liệu" });
    }
  });

  static upLoadImage = asyncHandler(async (req, res) => {
    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const file = req.file;
      const newpath = await uploader(file.path);
      fs.unlinkSync(file.path);
      res.json({
        message: "Tải ảnh lên thành công",
        newpath: newpath,
      });
    } catch (error) {
      res.status(401).json({
        message: "Có lỗi trong quá trình tải ảnh",
      });
    }
  });
}

module.exports = UserController;
