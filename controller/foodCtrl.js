const asyncHandler = require("express-async-handler");
const Food = require("../model/foodModel");

class FoodController {
    static create = asyncHandler(async (req, res) => {
        try {
            const newFood = await Food.create(req.body)
            return res.status(200).json({
                message: "Thêm thành công",
                data: newFood
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo " + error.message
            })
        }
    })
    static getAll = asyncHandler(async (req, res) => {
        try {
            const foods = await Food.find()
            return res.status(200).json({
                message: "Thành công",
                data: foods
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi  " + error.message
            })
        }
    })
}
module.exports = FoodController