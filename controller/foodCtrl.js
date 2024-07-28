const asyncHandler = require("express-async-handler");
const Food = require("../model/foodModel");
const UploadImageService = require("../service/uploadImage");

class FoodController {
  static create = asyncHandler(async (req, res) => {
    try {
      const newFood = await Food.create(req.body);
      return res.status(200).json({
        message: "Thêm thành công",
        data: newFood,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình tạo " + error.message,
      });
    }
  });
  static getAll = asyncHandler(async (req, res) => {
    try {
      const foods = await Food.find();
      return res.status(200).json({
        message: "Thành công",
        data: foods,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi  " + error.message,
      });
    }
  });
  static deleteFood = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;
      await Food.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Xóa thành công",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình xóa " + error.message,
      });
    }
  });
  static updateFood = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      let food = await Food.findById(id);
      if (!food) {
        return res.status(404).json({ message: "Không tìm thấy food" });
      }
      await Food.findByIdAndUpdate({ _id: id }, req.body, { new: true });
      res.status(200).json({ message: "Cập nhật  thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi sửa ", error: error.message });
    }
  });

  static uploadImgFood = asyncHandler(async (req, res) => {
    const img = await UploadImageService.upLoadImage(req, res, "food");
    res.json({
      message: "Thành công",
      data: img,
    });
  });
}
module.exports = FoodController;
