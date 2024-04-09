const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel");
const Movie = require("../model/movieModel");
const Branch = require("../model/branchModel");
const Room = require("../model/roomModel");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
class InterestController {
  static createInterest = asyncHandler(async (req, res) => {
    try {
      const { roomId, startTime, ...otherField } = req.body;
      const newStartTime = new Date(req.body.startTime);
      const movie = await Movie.findById(req.body.movie).select("duration");
      const movieDuration = movie.duration * 60000;
      const endTime = new Date(newStartTime.getTime() + movieDuration);
      console.log(newStartTime, endTime);
      const bStartTime = new Date(newStartTime.getTime() - 9 * 60000);
      const aEndTime = new Date(endTime.getTime() + 9 * 60000);
      const existingInterest = await Interest.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    $and: [
                      { startTime: { $gte: bStartTime } },
                      { startTime: { $lte: aEndTime } },
                    ],
                  },
                  {
                    $and: [
                      { endTime: { $gte: bStartTime } },
                      { endTime: { $lte: aEndTime } },
                    ],
                  },
                ],
              },
              { room: new mongoose.Types.ObjectId(roomId) },
            ],
          },
        },
      ]);
      console.log(existingInterest);
      if (existingInterest.length != 0) {
        return res.status(400).json({
          message: "Suất chiếu đã tồn tại trong khoảng thời gian này.",
        });
      }

      const data = {
        ...otherField,
        startTime: newStartTime,
        endTime: endTime,
        room: roomId,
      };

      const newInterest = await Interest.create(data);
      await Room.findByIdAndUpdate(
        roomId,
        { $push: { interests: newInterest._id } },
        { new: true }
      );

      return res.status(200).json({
        message: "Tạo suất chiếu phim thành công",
        data: newInterest,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình tạo suất chiếu phim " + error.message,
      });
    }
  });
  static getAllInterest = asyncHandler(async (req, res) => {
    try {
      const { roomId } = req.query;
      let interests;

      if (roomId) {
        interests = await Interest.find({ room: roomId }).populate("movie");
      } else {
        interests = await Interest.find().populate("movie");
      }

      return res.status(200).json({
        message: "Thành công",
        data: interests,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          "Có lỗi trong quá trình lấy dữ liệu suất chiếu phim " + error.message,
      });
    }
  });
  static getInterest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const interest = await Interest.findOne({ _id: id })
        .populate("movie", "name")
        .populate("room");
      if (!interest) {
        return res.status(404).json({
          message: "Không tìm thấy lịch chiếu",
        });
      }
      return res.status(200).json({
        message: "Thành công",
        data: interest,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình lấy suất chiếu phim " + error.message,
      });
    }
  });
  static getAllBranchInterest = asyncHandler(async (req, res) => {
    const { branchId } = req.query;
    console.log(branchId);
    try {
      let aggregationPipeline = [
        {
          $lookup: {
            from: "movies",
            localField: "movie",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "room",
            foreignField: "_id",
            as: "room",
          },
        },
        {
          $unwind: "$room",
        },
        {
          $unwind: "$movie",
        },
        {
          $lookup: {
            from: "branches",
            localField: "room.branch",
            foreignField: "_id",
            as: "branch",
          },
        },
        {
          $unwind: "$branch",
        },
        {
          $group: {
            _id: {
              branch: "$room.branch",
              date: {
                $dateToString: {
                  format: "%d-%m-%Y",
                  date: {
                    $add: ["$startTime", 25200000],
                  },
                },
              },
              movie: "$movie.name",
              description: "$movie.description",
              genre: "$movie.genre",
              cast: "$movie.cast",
              director: "$movie.director",
              trailer: "$movie.trailer",
              duration: "$movie.duration",
              image: "$movie.image",
            },
            interests: {
              $push: {
                _id: "$_id",
                branch: "$room.branch",
                startTime: "$startTime",
                endTime: "$endTime",
                room: "$room",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              branch: "$_id.branch",
              date: "$_id.date",
            },
            movies: {
              $push: {
                name: "$_id.movie",
                description: "$_id.description",
                genre: "$_id.genre",
                cast: "$_id.cast",
                director: "$_id.director",
                trailer: "$_id.trailer",
                duration: "$_id.duration",
                image: "$_id.image",
                interests: "$interests",
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id.branch",
            dates: {
              $push: {
                date: "$_id.date",
                movies: "$movies",
              },
            },
          },
        },
        {
          $project: {
            branch: "$_id",
            dates: 1,
            _id: 0,
          },
        },
      ];

      if (branchId) {
        aggregationPipeline.push({
          $match: { branch: new mongoose.Types.ObjectId(branchId) },
        });
      }

      const interests = await Interest.aggregate(aggregationPipeline);
      console.log(interests);

      return res.status(200).json({
        message: "Thành công",
        data: interests,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          "Có lỗi trong quá trình lấy dữ liệu suất chiếu phim " + error.message,
      });
    }
  });
  static getMovieInterest = asyncHandler(async (req, res) => {
    const movie = req.params.id;
    try {
      const showtimes = await Interest.aggregate([
        {
          $lookup: {
            from: "movies",
            localField: "movie",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "room",
            foreignField: "_id",
            as: "room",
          },
        },
        {
          $unwind: "$room",
          $unwind: "$movie",
        },
        {
          $lookup: {
            from: "branches",
            localField: "room.branch",
            foreignField: "_id",
            as: "branch",
          },
        },
        {
          $unwind: "$branch",
        },
        {
          $match: { "movie._id": new mongoose.Types.ObjectId(movie) },
        },
        {
          $group: {
            _id: {
              branch: "$room.branch",
              date: {
                $dateToString: { format: "%d-%m-%Y", date: "$startTime" },
              },
              movie: "$movie.name",
              description: "$movie.description",
              genre: "$movie.genre",
              cast: "$movie.cast",
              director: "$movie.director",
              trailer: "$movie.trailer",
              duration: "$movie.duration",
              image: "$movie.image",
            },
            interests: {
              $push: {
                _id: "$_id",
                branch: "$room.branch",
                startTime: "$startTime",
                endTime: "$endTime",
                room: "$room",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              branch: "$_id.branch",
              date: "$_id.date",
            },
            movies: {
              $push: {
                name: "$_id.movie",
                description: "$_id.description",
                genre: "$_id.genre",
                cast: "$_id.cast",
                director: "$_id.director",
                trailer: "$_id.trailer",
                duration: "$_id.duration",
                image: "$_id.image",
                interests: "$interests",
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id.branch",
            dates: {
              $push: {
                date: "$_id.date",
                movies: "$movies",
              },
            },
          },
        },
        {
          $project: {
            branch: "$_id",
            dates: 1,
            _id: 0,
          },
        },
      ]);
      return res.status(200).json({
        message: "Thành công",
        data: showtimes,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          "Có lỗi trong quá trình lấy dữ liệu suất chiếu phim " + error.message,
      });
    }
  });
  static updateInterest = asyncHandler(async (req, res) => {
    const { bookedSeats } = req.body;
    console.log(bookedSeats);
    try {
      const interestId = req.params.id;
      const interest = await Interest.findById(interestId);

      if (interest.bookedSeats.includes(bookedSeats)) {
        return res.status(400).json({
          message: "Ghế đã được đặt trước đó.",
        });
      }

      interest.bookedSeats.push(bookedSeats);
      interest.save();

      return res.status(200).json({
        message: "Cập nhật ghế thành công",
        data: interest,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình cập nhật ghế " + error.message,
      });
    }
  });
  static updateStatusInterest = asyncHandler(async (req, res) => {
    try {
      const interests = await Interest.find();
      const currentTime = new Date();
      const vietnamTime = new Date(
        currentTime.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );

      for (let interest of interests) {
        if (
          vietnamTime >= interest.startTime &&
          vietnamTime <= interest.endTime
        ) {
          interest.status = "Đang diễn ra";
          console.log("giờ hiện tại", vietnamTime.toISOString());
          console.log("giờ phim chiếu", interest.startTime.toISOString());
          console.log(interest.status);
        } else if (vietnamTime > interest.endTime) {
          interest.status = "Đã kết thúc";
          console.log("giờ hiện tại", vietnamTime.toISOString());
          console.log("giờ phim chiếu", interest.startTime.toISOString());
          console.log(interest.status);
        } else {
          interest.status = "Chưa bắt đầu";
          console.log("giờ hiện tại", vietnamTime.toISOString());
          console.log("giờ phim chiếu", interest.startTime.toISOString());
          console.log(interest.status);
        }
        await interest.save();
      }
      return res.status(200).json({
        message: "Cập nhật trạng thái suất chiếu thành công",
      });
    } catch (error) {
      return res.status(500).json({
        message:
          "Có lỗi trong quá trình cập nhật trạng thái suất chiếu: " +
          error.message,
      });
    }
  });
  static getInterestByMovie = asyncHandler(async (req, res) => {
    const { idMovie , status ="Chưa bắt đầu" } = req.query;
    try {
        const query = {};
        if (status) {
          query["status"] = status;
        }
        if (idMovie) {
            query["movie"] = idMovie;
        }

        console.log(query);
        const interest = await Interest.find(query).populate("movie").populate("room");
        res.json(interest);
    } catch (error) {
        throw new Error();
    }
});

}
module.exports = InterestController;
