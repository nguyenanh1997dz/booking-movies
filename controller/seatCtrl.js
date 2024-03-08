const asyncHandler = require("express-async-handler");
const Seat = require("../model/seatModel")

class SeatController {
    static createSeat = asyncHandler(async (req, res) => {
        try {
            const newSeat = await Seat.create(req.body)
            return res.status(200).json({
                message: "Tạo ghế thành công",
                data: newSeat
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo ghế " + error.message
            })
        }
    })
    static getAllSeat = asyncHandler(async (req, res) => {
        try {
            const seats = await Seat.find()
            return res.status(200).json({
                message: "Thành công",
                data: seats
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu ghế " + error.message
            })
        }
    })

}
module.exports = SeatController;