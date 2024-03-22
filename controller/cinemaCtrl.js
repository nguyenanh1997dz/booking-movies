const asyncHandler = require("express-async-handler");
const Cinema = require("../model/cinemaModel");
class CinemaController {
    static createCinema = asyncHandler(async (req, res) => {
        try {
            const newCinema = await Cinema.create(req.body)
            return res.status(200).json({
                message: "Tạo rạp thành công",
                data: newCinema
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo rạp" + error.message
            })
        }
    })
    static getAllCinema = asyncHandler(async (req, res) => {
        try {
            const allCinema = await Cinema.find().populate({
                path: 'branches',
            });
            return res.status(200).json({
                message: "Thành công",
                data: allCinema
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi lấy rạp " + error.message
            })
        }
    })
    static getCinemaById = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const cinema = await Cinema.findById(id)
            return res.status(200).json({
                message: "Thành công",
                data: cinema
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi lấy rạp " + error.message
            })
        }
    })

    static updateCinema = asyncHandler(async (req, res) => {
        const { id } = req.params
        const updateCinema = await Cinema.findOneAndUpdate({ _id: id }, req.body, { new: true })
        console.log(updateCinema);
        return res.status(200).json({})
    })
}
module.exports = CinemaController