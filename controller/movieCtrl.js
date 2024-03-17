const UploadImageController = require("../service/uploadImage")

const asyncHandler = require("express-async-handler");
const Movie = require("../model/movieModel");
const Genre = require("../model/genreModel");
const { parse } = require("dotenv");

class MovieController {
  static createMovie = asyncHandler(async (req, res) => {
    const img = await UploadImageController.upLoadImage(req, res)
    try {


      const { genre } = req.body

      const movie = new Movie({

        ...req.body,
        images: img,
        genre: JSON.parse(genre),
      });

      console.log(movie)
      await movie.save();
      res.send('Phim đã được tạo thành công');
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  });

  static getAllMovie = asyncHandler(async (req, res) => {
    const { page = 1, sort = '-createdAt', limit = 5, fields, genre, name, ...otherQueryParams } = req.query;
    let query = Movie.find(otherQueryParams).populate("genre", "name");
    query = query.sort(sort);
    if (genre) {
      const genreObject = await Genre.findOne({ name: new RegExp('^' + genre.trim() + '$', "i") });
      if (genreObject) {
        query = query.where("genre").in([genreObject._id]);
      } else {
        return res.status(401).json({
          message: "Không tìm thấy phim phù hợp",
        });
      }
    }
    if (fields) {
      query = query.select(fields.split(","));
    } else {
      query = query.select("-__v");
    }
    if (name) {
      const keyword = name.trim();
      const regex = new RegExp(keyword, 'i');
      query = query.where('name').regex(regex);
    }

    const skip = (page - 1) * limit;
    const movie = await query.skip(skip).limit(limit);
    const totalCount = await Movie.countDocuments(otherQueryParams);
    const totalPages = Math.ceil(totalCount / limit);
    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Trang không tồn tại" });
    }
    return res.status(200).json({
      message: "Thành công",
      movie: movie,
      currentPage: page,
      totalPages: totalPages
    });
  });

  static getMovieById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const movie = await Movie.findById(id).populate("genre").exec();
      if (!movie) {
        return res.status(404).json({
          message: "Không tìm thấy bộ phim",
        });
      }
      return res.status(200).json({
        message: "Thành công",
        data: movie,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình lấy dữ liệu phim: " + error.message,
      });
    }
  });

  static deleteMovie = asyncHandler(async (req, res) => {
    const movieId = req.params.id;

    try {
      const foundMovie = await Movie.findById(movieId);
      if (!foundMovie) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy bộ phim' });
      }
      const publicId = foundMovie.images.url
      const filename = foundMovie.images.filename
      const xoaanh = await UploadImageController.deleteImage(publicId, filename)

      const deletedMovie = await Movie.findOneAndDelete({ _id: movieId })
      res.send('xóa phim thành công');
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi xóa phim', error: error.message });
    }
  })
}
module.exports = MovieController;
