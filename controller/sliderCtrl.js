const UploadImageService = require("../service/uploadImage");

const asyncHandler = require("express-async-handler");
const Slider = require("../model/sliderModel");
const { request } = require("express");

class sliderController {
  static createSlider = asyncHandler(async (req, res) => {
    try {
      console.log(req.body)
        const newSlider = await Slider.create(req.body)
        return res.status(200).json({
            message: "Tạo Slider thành công",
            data: newSlider
        })
    } catch (error) {
        return res.status(500).json({
            message: "Có lỗi trong quá trình tạo Slider" + error.message
        })
    }
})

  static getAllSlider = asyncHandler(async (req, res) => {
    try {
      const sliders = await Slider.find({});
      res.status(200).json({
        message: "Lấy tất cả slider thành công",
        data: sliders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Lỗi lấy tất cả slider",
        error: error.message,
      });
    }
  });

  static deleteSlider = asyncHandler(async (req, res) => {
    try {
        const sliderId = req.params.id



        await Slider.findByIdAndDelete(sliderId)
        // await branch.save()

        return res.status(200).json({
            message: "Xóa slider thành công",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Có lỗi trong quá trình xóa slider " + error.message
        })
    }
})

  static updateSlider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      let slider = await slider.findById(id);
      console.log(slider)
      if (!slider) {
        return res.status(404).json({ message: "Không tìm thấy slider" });
      }
      await slider.findByIdAndUpdate({ _id: id }, req.body, { new: true });
      res.status(200).json({ message: "Cập nhật slider thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi sửa slider", error: error.message });
    }
  });



}
module.exports = sliderController;