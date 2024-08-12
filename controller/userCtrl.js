const { verifyToken } = require("../config/verifyToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var notp = require("notp");
const sendEmail = require("../utils/sendMail");
const UploadImageService = require("../service/uploadImage");

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
    if (findUser && findUser.isBlocked == true)
      res.status(403).json({ message: "Tài khoản đã bị khóa" });
    if (findUser && (await findUser.isPasswordMatched(password))) {
     
      const accessToken = jwt.sign(
        { userId: findUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
     
      return res.status(200).json({
        accessToken: accessToken,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
  });

  static googleLogin = asyncHandler(async (req, res) => {
    const { email, name, id : googleId, image } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
    
      if (user.googleId === googleId) {
        const accessToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
            accessToken
           
        });
      } else if (user.googleId && user.googleId !== googleId) {
        
        return res.status(400).json({
          status: false,
          message: "Email này đã được sử dụng bởi tài khoản Google khác.",
        });
      } else {
        
        return res.status(409).json({
          status: false,
          message: "Email này đã được sử dụng. Bạn có muốn liên kết với tài khoản Google của bạn không?",
        });
      }
    } else {

      user = await User.create({
        email,
        googleId,
        googleImage: image,
        fullName: name
      });

      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        accessToken,
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Xác thực không thành công",
    });
  }
  });

  static getCurentUser = asyncHandler(async (req, res) =>{
    const { id } = req.user;
    const user = await User.findById(id);
    res.json(user);
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
  static changePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }
      if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json({
          message: "Cập nhật mật khẩu thành công",
          data: updatedPassword.password,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi cập nhật thông tin người dùng." });
    }
  });
  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.params;
    if (!email) throw new Error("Không có email");
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không có trong database");
    const otp = notp.totp.gen(process.env.KEY_SECRET_OTP);
    console.log(typeof otp);
    const html = `
        <p>Xin chào ${user.fullName},</p>
        <p>Dưới đây là mã OTP của bạn để đặt lại mật khẩu có hiệu lực trong vòng 5 phút:</p>
        <h2 style="background-color: #f4f4f4; padding: 10px; display:inline">${otp}</h2>
        <p>Đừng chia sẻ mã OTP này với người khác.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ hỗ trợ của chúng tôi</p>
    `;
    const data = {
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: html,
    };
    try {
      await sendEmail(data);
      return res.json({
        message: "Email chứa mã OTP đã được gửi đến địa chỉ email của bạn.",
      });
    } catch (error) {
      throw new Error("Đã xảy ra lỗi khi gửi email.");
    }
  });
  static reset_Password = asyncHandler(async (req, res) => {
    const { otp, password, email } = req.body;
    if (!otp || !password || !email) {
      return res.status(401).json({
        message: "Thiếu thông tin.",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Không tìm thấy email.",
      });
    }
    const verified = notp.totp.verify(otp, process.env.KEY_SECRET_OTP);
    console.log(otp, verified);
    if (!verified) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ" });
    }
    user.password = password;
    const updatedPassword = await user.save();
    res.status(200).json({ message: "Thành công", data: updatedPassword });
  });
  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    try {
      const deleteaUser = await User.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa thành công",
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
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
  static updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, password, address, phone, avatar } = req.body;

    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy tài khoản",
        });
      }
      user.fullName = fullName ?? user.fullName;
      user.password = password ?? user.password;
      user.address = address ?? user.address;
      user.phone = phone ?? user.phone;
      if (avatar) {
        user.avatar.url = avatar.url;
        user.avatar.publicId = avatar.publicId;
      }

      await user.save();
      res.status(200).json({
        message: "Cập nhật thành công",
        data: user,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Có lỗi khi cập nhật dữ liệu", err: error.message });
    }
  });
  static uploadAvatar = asyncHandler(async (req, res) => {
    const img = await UploadImageService.upLoadImage(req, res, "avatar");
    res.json({
      message: "Thành công",
      data: img,
    });
  });
}

module.exports = UserController;
