const asyncHandler = require("express-async-handler");
const Movie = require("../model/movieModel");
const Genre = require("../model/genreModel");
class MovieController {
  static createMovie = asyncHandler(async (req, res) => {
    try {
      const newMovie = await Movie.create(req.body);
      return res.status(200).json({
        message: "Tạo phim thành công",
        data: newMovie,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình tạo phim " + error.message,
      });
    }
  });
  static getAllMovie = asyncHandler(async (req, res) => {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields", "genre"]
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Movie.find(JSON.parse(queryStr)).populate("genre");
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    if (req.query.genre) {
        const genre = req.query.genre.trim();
        const genreObject = await Genre.findOne({ name: new RegExp('^' + genre + '$', "i") });
        console.log(genreObject);
        if (genreObject) {
          query = query.where("genre").in([genreObject._id]); 
        }
      }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    if (req.query.name) {
        const keyword = req.query.name.trim(); //
        const regex = new RegExp(keyword, 'i'); 
        query = query.where('name').regex(regex);
      }
    const page = req.query.page;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit || 0;
  
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const movieCount = await Movie.countDocuments();
      if (skip >= movieCount) throw new Error("This Page does not exists");
    }
    
    const movie = await query;
    return res.json({
      movie: movie,
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
}
module.exports = MovieController;
