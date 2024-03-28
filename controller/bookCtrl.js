const asyncHandler = require("express-async-handler");
const Book = require("../model/bookModel")
const User = require("../model/userModel")
const Interest = require("../model/interestModel");
const moment = require("moment");

class BookController {
    static createBook = asyncHandler(async (req, res) => {
        try {
            const newBook =  new Book(req.body)
            const interest = await Interest.findById(newBook.interest)
            const  user = await User.findById(newBook.user)
            const duplicateSeats = newBook.seats.filter(seat => interest.bookedSeats.includes(seat));
            if (duplicateSeats.length > 0) {
                return res.status(403).json({
                    message: "Đặt vé thất bại",
                    data: `Ghế ${duplicateSeats.join(", ")} đã có người đặt`
                }); 
            }
            interest.bookedSeats.push(...newBook.seats)
            await newBook.save();
            await interest.save()
            user.bookings.push(newBook._id)
            await user.save();
            return res.status(200).json({
                message: "Đặt vé thành công",
                data: newBook
            }); 
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Có lỗi trong quá trình đặt vé " + error.message
            });
        }
    });
    static getAllBook = asyncHandler(async (req, res) => {
        const { user, sort = '-createdAt' } = req.query;
        const validQueryFields = ["user", "branch", "interest","room"];
        try {
            const query = {};
            validQueryFields.forEach(field => {
                if (req.query[field]) {
                    query[field] = req.query[field];
                }
            });
            const books = await Book.find(query).sort(sort);
            return res.status(200).json({
                message: "Thành công",
                data: books
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu đặt vé " + error.message
            });
        }
    });
    
    static getBookById = asyncHandler(async (req, res) => {
        const {id} = req.params
        try {
            const books = await Book.findById(id)
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