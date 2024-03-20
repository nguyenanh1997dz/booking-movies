const asyncHandler = require("express-async-handler");
const Genre = require("../model/genreModel")
const Movie = require("../model/movieModel")

class GenreController {
    static createGenre = asyncHandler(async (req, res) => {
        try {
            const newGenre = await Genre.create(req.body)
            return res.status(200).json({
                message: "Tạo thể loại phim thành công",
                data: newGenre
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo thể loại phim " + error.message
            })
        }
    })
    static getAllGenre = asyncHandler(async (req, res) => {
        try {
            const genres = await Genre.find()
            return res.status(200).json({
                message: "Thành công",
                data: genres
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu thể loại phim " + error.message
            })
        }
    })
    static getGenreById = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const genre = await Genre.findById(id).exec();
            if (!genre) {
                return res.status(404).json({
                    message: "Không tìm thấy thể loại phim"
                });
            }
            return res.status(200).json({
                message: "Thành công",
                data: genre
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu thể loại phim " + error.message
            });
        }
    })
    static deleteGenre = asyncHandler(async (req, res) => {
        try {
            const genreId = req.params.id



            await Movie.updateMany({ genre: genreId }, { $pull: { genre: genreId } })
            await Genre.findByIdAndDelete(genreId)
            // await branch.save()

            return res.status(200).json({
                message: "Xóa thể loại thành công",
            });

        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình xóa thể loại " + error.message
            })
        }
    })
}
module.exports = GenreController;