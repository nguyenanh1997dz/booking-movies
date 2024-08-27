const UploadImageService = require("../service/uploadImage");

const asyncHandler = require("express-async-handler");
const Movie = require("../model/movieModel");
const Genre = require("../model/genreModel");
const User = require("../model/userModel");
const { default: mongoose } = require("mongoose");
const moment = require("moment/moment");

class MovieController {
  static createMovie = asyncHandler(async (req, res) => {
    try {
      const movie = Movie.create(req.body);
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
  });

  static deleteImageMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let formatId = "movies/" + id;
    await UploadImageService.deleteImage(formatId);
    res.json({
      message: "Thành công",
      data: "img",
    });
  });

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
      totalCount,
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
      res.status(500).json({
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
      await Movie.findByIdAndUpdate({ _id: id }, req.body, { new: true });
      res.status(200).json({ message: "Cập nhật bộ phim thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi sửa phim", error: error.message });
    }
  });

  static getTopMovies = asyncHandler(async (req, res) => {
    try {
      const topMovies = await Movie.find().sort({ view: -1 }).limit(10);

      res.status(200).json({
        message: "Thành công",
        data: topMovies,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Có lỗi trong quá trình lấy dữ liệu phim: ${error.message}`,
      });
    }
  });
  static reviewMovies = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { movieId, star, comment } = req.body;

    try {
      const movie = await Movie.findById(movieId);

      if (!movie) {
        return res.status(404).json({ message: "Không tìm thấy bộ phim" });
      }
      let alreadyRated = movie.ratings.find(
        (rating) => rating.postedby.toString() === id.toString()
      );
      if (alreadyRated) {
        const updateRating = await Movie.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "ratings.$.star": +star, "ratings.$.comment": comment },
          },
          {
            new: true,
          }
        );
      } else {
        const rateMovie = await Movie.findByIdAndUpdate(
          movieId,
          {
            $push: {
              ratings: {
                star: +star,
                comment: comment,
                postedby: id,
              },
            },
          },
          {
            new: true,
          }
        );
      }
      const getallratings = await Movie.findById(movieId);
      let totalRating = getallratings.ratings.length;
      let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
      let actualRating = Math.round((ratingsum / totalRating) * 2) / 2;
      let countRatings = getallratings.ratings.length || 0;

      let finalMovie = await Movie.findByIdAndUpdate(
        movieId,
        {
          totalrating: actualRating,
          countRating: countRatings,
        },
        { new: true }
      );
      res.json(finalMovie);
    } catch (error) {
      throw new Error(error);
    }
  });
  static getMovieReviewDetail = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const result = await Movie.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(movieId),
        },
      },
      {
        $unwind: "$ratings",
      },
      // Add a formatted date field to each rating
      {
        $addFields: {
          "ratings.formattedDate": {
            $dateToString: {
              format: "%Y-%m-%d %H:%M:%S",
              date: "$ratings.createdAt",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ratings.postedby",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      // Group by movie _id, collecting review details and counting star ratings
      {
        $group: {
          _id: "$_id",
          movieName: { $first: "$name" },
          reviews: {
            $push: {
              _id: "$ratings._id",
              star: "$ratings.star",
              comment: "$ratings.comment",
              user: "$user.fullName",
              userId: "$user._id",
              date: "$ratings.formattedDate",
              like: "$ratings.likes",
              dislike: "$ratings.dislikes",
              likedBy: "$ratings.likedBy",
              dislikedBy: "$ratings.dislikedBy",
            },
          },
          starCounts: {
            $push: "$ratings.star",
          },
        },
      },
      // Calculate the count for each star rating
      {
        $addFields: {
          starCounts: {
            $arrayToObject: {
              $map: {
                input: [
                  { star: 1 },
                  { star: 2 },
                  { star: 3 },
                  { star: 4 },
                  { star: 5 },
                ],
                as: "s",
                in: {
                  k: { $concat: ["star", { $toString: "$$s.star" }] },
                  v: {
                    $size: {
                      $filter: {
                        input: "$starCounts",
                        as: "star",
                        cond: { $eq: ["$$star", "$$s.star"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          reviews: 1,
          movieName: 1,
          starCounts: 1,
          likeBy: 1,
        },
      },
    ]);
    return res.json(result[0] || {});
  });
  static updateCommentReaction = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { commentId, movieId, action } = req.body;

    const comment = await Movie.findOne(
      { _id: movieId, "ratings._id": commentId },
      { "ratings.$": 1 }
    );

    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy comment" });
    }

    const isUserLikedComment = comment.ratings[0].likedBy.includes(id);
    const isUserDislikedComment = comment.ratings[0].dislikedBy.includes(id);

    let update = {};
    let reaction
    if (action === "like") {
      if (isUserLikedComment) {
        // Nếu người dùng đã thích, hủy thích
        update = {
          $pull: { "ratings.$.likedBy": id },
          $inc: { "ratings.$.likes": -1 },
        };
        reaction = "dislike"
      } else {
        // Nếu người dùng chưa thích
        update = {
          $addToSet: { "ratings.$.likedBy": id },
          $inc: { "ratings.$.likes": 1 },
        };
        reaction = "like"
        if (isUserDislikedComment) {
          // Nếu người dùng đã ghét, bỏ ghét
          update.$pull = { "ratings.$.dislikedBy": id };
          update.$inc = { ...update.$inc, "ratings.$.dislikes": -1 };
        }
      }
    } else if (action === "dislike") {
      if (isUserDislikedComment) {
        // Nếu người dùng đã ghét, hủy ghét
        update = {
          $pull: { "ratings.$.dislikedBy": id },
          $inc: { "ratings.$.dislikes": -1 },
        };
        reaction = "bỏ dislike"
      } else {
        // Nếu người dùng chưa ghét
        update = {
          $addToSet: { "ratings.$.dislikedBy": id },
          $inc: { "ratings.$.dislikes": 1 },
        };
        reaction = "dislike"
        if (isUserLikedComment) {
          // Nếu người dùng đã thích, bỏ thích
          update.$pull = { "ratings.$.likedBy": id };
          update.$inc = { ...update.$inc, "ratings.$.likes": -1 };
        }
      }
    }

    const result = await Movie.updateOne(
      { _id: movieId, "ratings._id": commentId },
      update
    );

    return res.json({status: true, message: `${reaction} thành công`});
  });
}
module.exports = MovieController;
