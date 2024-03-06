const asyncHandler = require("express-async-handler");
const Movie = require("../model/movieModel")

class MovieController {
    static createMovie  = asyncHandler(async (req,res) =>{
        try {
           const newMovie = await  Movie.create(req.body)
            return res.status(200).json({
                message: "Tạo phim thành công",
                data: newMovie
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo phim " + error.message
            })
        }
    })
    static getAllMovie = asyncHandler(async (req,res) =>{
        try {
            const movies = await  Movie.find().populate('genre').exec()
             return res.status(200).json({
                 message: "Thành công",
                 data: movies
             })
         } catch (error) {
             return res.status(500).json({
                 message: "Có lỗi trong quá trình lấy dữ liệu phim" + error.message
             })
         }
    })
    static getMovieById = asyncHandler(async (req,res) =>{
        const {id} = req.params
        try {
            const movie = await Movie.findById(id).populate('genre').exec();
            if (!movie) {
                return res.status(404).json({
                    message: "Không tìm thấy bộ phim"
                });
            }
            return res.status(200).json({
                message: "Thành công",
                data: movie
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu phim: " + error.message
            });
        }
    })
}
module.exports = MovieController;