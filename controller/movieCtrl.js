const UploadImageService = require("../service/uploadImage");

const asyncHandler = require("express-async-handler");
const Movie = require("../model/movieModel");
const Genre = require("../model/genreModel");
const { request } = require("express");

class MovieController {
  static createMovie = asyncHandler(async (req, res) => {
    try {
      const movie = Movie.create(req.body)
      res.status(200).json({
        message: "Tạo phim thành công",
        data: movie,
      });
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  });

  static uploadImgMovie = asyncHandler(async (req, res) => {
    const img = await UploadImageService.upLoadImage(req, res, "movies");
    res.json({
      message: "Thành công",
      data: img,
    });
  })

  static deleteImageMovie = asyncHandler(async (req, res) => {
    const { id } = req.params
    let formatId = "movies/" + id;
    await UploadImageService.deleteImage(formatId)
    res.json({
      message: "Thành công",
      data: "img",
    });
  })

  static getAllMovie = asyncHandler(async (req, res) => {
    let {
      page = 1,
      sort = "-createdAt",
      limit = 0,
      fields,
      genre,
      name,
      ...otherQueryParams
    } = req.query;
    page = parseInt(page);
    let query = Movie.find(otherQueryParams).populate("genre", "name");
    query = query.sort(sort);
    if (genre) {
      const genreObject = await Genre.findOne({
        name: new RegExp("^" + genre.trim() + "$", "i"),
      });
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
      const regex = new RegExp(keyword, "i");
      query = query.where("name").regex(regex);
    }
    const totalCountQuery = query.clone();
    const totalCount = await totalCountQuery.countDocuments();
    const skip = (page - 1) * limit;
    const movie = await query.skip(skip).limit(limit);
    let totalPages = Math.ceil(totalCount / limit);
    if (limit === 0) {
      totalPages = 1;
    }
    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Không có dữ liệu" });
    }
    return res.status(200).json({
      message: "Thành công",
      movie: movie,
      currentPage: page,
      totalPages,
      totalCount
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
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy bộ phim" });
      }
      await Movie.findOneAndDelete({ _id: movieId });
      res.send("xóa phim thành công");
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi xóa phim",
          error: error.message,
        });
    }
  });

  static updateMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      let movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ message: "Không tìm thấy bộ phim" });
      }
      await Movie.findByIdAndUpdate({_id : id}, req.body ,{new: true});
      res.status(200).json({ message: "Cập nhật bộ phim thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi sửa phim", error: error.message });
    }
  });
}
module.exports = MovieController;