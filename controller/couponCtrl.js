const asyncHandler = require("express-async-handler");
const Coupon = require("../model/couponModel");
const moment = require("moment");
class CouponController {
  static create = asyncHandler(async (req, res) => {
    try {
      const newCoupon = await Coupon.create(req.body);
      return res.status(200).json({
        message: "Thêm thành công",
        data: newCoupon,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình tạo " + error.message,
      });
    }
  });
  static getAll = asyncHandler(async (req, res) => {
    const result = await Coupon.find({})
    return res.status(200).json(result);
  })
  static checkCode = asyncHandler(async (req, res) => {
    try {
      const { code, totalAmount } = req.body;
      if (totalAmount === undefined || totalAmount === null) {
        return res.status(400).json({ message: "Total amount is required" });
      }

      const coupon = await Coupon.findOne({ code });
      if (!coupon) {
        return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
      }
      if (
        coupon.status === "expired" ||
        moment().isAfter(coupon.expirationDate)
      ) {
        return res
          .status(400)
          .json({ message: "Mã giảm giá đã hết hạn sử dụng" });
      }
      if (totalAmount < coupon.minPurchase) {
        return res.status(400).json({ message: `Chưa đạt giá trị tối thiểu đơn hàng` });
      }
      res.status(200).json({ message: "Mã giảm giá chính xác", coupon });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  static delete = asyncHandler(async (req, res)  => {
    try {
      const {id} = req.params
      await Coupon.findByIdAndDelete(id)
      // await branch.save()
      return res.status(200).json({
          message: "Xóa Blog thành công",
      });

  } catch (error) {
      return res.status(500).json({
          message: "Có lỗi trong quá trình xóa blog " + error.message
      })
  }
  })
}
module.exports = CouponController;
