const asyncHandler = require("express-async-handler");
const Book = require("../model/bookModel")
const User = require("../model/userModel")
const Interest = require("../model/interestModel")

class BookController {
    static createBook = asyncHandler(async (req, res) => {
        try {
            const newBook = await Book.create(req.body)
            return res.status(200).json({
                message: "Đặt vé thành công",
                data: newBook
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình đặt vé " + error.message
            })
        }
    })
    static getAllBook = asyncHandler(async (req, res) => {
        try {
            const books = await Book.find().populate("user", "fullName").populate("interest", "name")
            return res.status(200).json({
                message: "Thành công",
                data: books
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu đặt vé " + error.message
            })
        }
    })

}
module.exports = BookController;